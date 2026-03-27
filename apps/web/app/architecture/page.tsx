"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  ShieldCheck, Lock, Globe, Cpu, ArrowRight,
  ChevronRight, Code2, Network, Webhook,
} from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const CONTRACTS = [
  {
    name: "TenderRegistry",
    tag: "contracts/tender-registry",
    language: "Rust · Soroban",
    desc: "The authoritative on-chain record for all public procurement opportunities. Manages state transitions from Open → Bidding → Awarded → Completed with time-locked phase gates.",
    functions: [
      { sig: "create_tender(authority: Address, params: TenderParams) -> TenderId", access: "Authority Only" },
      { sig: "submit_bid(tender_id: TenderId, bid: BidParams) -> BidId", access: "Verified Vendor" },
      { sig: "award_contract(tender_id: TenderId, bid_id: BidId)", access: "Multi-Sig (3-of-5)" },
      { sig: "get_tender(id: TenderId) -> Tender", access: "Public" },
    ],
    code: `pub fn create_tender(
    env: Env,
    authority: Address,
    params: TenderParams,
) -> u64 {
    authority.require_auth();

    let tender_id = env.storage()
        .instance()
        .get(&DataKey::TenderCount)
        .unwrap_or(0u64) + 1;

    let tender = Tender {
        id: tender_id,
        authority: authority.clone(),
        title: params.title,
        value: params.estimated_value,
        deadline: params.submission_deadline,
        status: TenderStatus::Open,
        bids: Vec::new(&env),
        created_at: env.ledger().timestamp(),
    };

    env.storage().persistent()
        .set(&DataKey::Tender(tender_id), &tender);

    env.events().publish(
        (symbol_short!("TENDER"), symbol_short!("CREATED")),
        tender_id,
    );

    tender_id
}`,
  },
  {
    name: "MilestoneEscrow",
    tag: "contracts/milestone-escrow",
    language: "Rust · Soroban",
    desc: "A high-integrity fund custody mechanism. Locks project capital at contract award and releases tranches only upon cryptographic multi-signature verification of specific deliverables.",
    functions: [
      { sig: "lock_funds(contract_id: u64, amount: i128, asset: Address)", access: "Authority Only" },
      { sig: "verify_milestone(contract_id: u64, milestone_idx: u32, evidence_hash: Bytes)", access: "Auditor" },
      { sig: "release_tranche(contract_id: u64, milestone_idx: u32)", access: "Multi-Sig (2-of-3)" },
      { sig: "dispute_milestone(contract_id: u64, milestone_idx: u32, reason: String)", access: "Vendor or Auditor" },
    ],
    code: `pub fn release_tranche(
    env: Env,
    contract_id: u64,
    milestone_idx: u32,
) -> Result<(), EscrowError> {
    let escrow: EscrowContract = env.storage()
        .persistent()
        .get(&DataKey::Escrow(contract_id))
        .ok_or(EscrowError::NotFound)?;

    let milestone = escrow.milestones
        .get(milestone_idx)
        .ok_or(EscrowError::InvalidMilestone)?;

    if milestone.approvals < escrow.required_sigs {
        return Err(EscrowError::InsufficientSignatures);
    }

    if milestone.status != MilestoneStatus::Verified {
        return Err(EscrowError::NotVerified);
    }

    token::Client::new(&env, &escrow.asset)
        .transfer(&env.current_contract_address(),
                  &escrow.vendor,
                  &milestone.amount);

    env.events().publish(
        (symbol_short!("TRANCHE"), symbol_short!("RELEASED")),
        (contract_id, milestone_idx, milestone.amount),
    );

    Ok(())
}`,
  },
  {
    name: "VendorReputation",
    tag: "contracts/vendor-reputation",
    language: "Rust · Soroban",
    desc: "An objective, soulbound reputation ledger. Scores are computed from historical delivery data — on-time rates, audit outcomes, dispute history. Non-transferable and manipulation-resistant.",
    functions: [
      { sig: "register_vendor(vendor: Address, kyb_hash: Bytes) -> VendorId", access: "Permissioned Registrar" },
      { sig: "record_completion(vendor: Address, on_time: bool, audit_score: u32)", access: "Escrow Contract Only" },
      { sig: "get_score(vendor: Address) -> ReputationScore", access: "Public" },
      { sig: "slash_reputation(vendor: Address, reason: SlashReason)", access: "Governance Multi-Sig" },
    ],
    code: `pub fn record_completion(
    env: Env,
    vendor: Address,
    on_time: bool,
    audit_score: u32,
) {
    // Only callable by the MilestoneEscrow contract
    let escrow_addr: Address = env.storage()
        .instance()
        .get(&DataKey::EscrowContract)
        .unwrap();
    escrow_addr.require_auth();

    let mut profile: VendorProfile = env.storage()
        .persistent()
        .get(&DataKey::Vendor(vendor.clone()))
        .unwrap_or_default();

    profile.completions += 1;
    if on_time { profile.on_time += 1; }

    // Exponential moving average — recent performance weighted higher
    let new_score = ((audit_score as u64 * 30)
        + (profile.score as u64 * 70)) / 100;
    profile.score = new_score as u32;

    env.storage().persistent()
        .set(&DataKey::Vendor(vendor), &profile);
}`,
  },
];

const SECURITY = [
  { icon: ShieldCheck, title: "Soroban Native Auth", desc: "Every sensitive function is guarded by Soroban's built-in authorization framework. Unauthorized calls revert atomically with no state changes." },
  { icon: Lock, title: "No Admin Keys", desc: "CivicLedger has zero privileged deployer keys. Once deployed, contracts operate entirely through their encoded governance logic." },
  { icon: Network, title: "Multi-Sig Consensus", desc: "Fund releases and contract awards require M-of-N signature sets. Signer sets are configurable per jurisdiction and stored on-chain." },
  { icon: Globe, title: "Immutable Audit Log", desc: "Every event emitted by CivicLedger contracts is permanently recorded in Stellar ledger history, accessible to any observer indefinitely." },
];

const API_ENDPOINTS = [
  { method: "GET", path: "/api/v1/tenders", desc: "List all tenders with optional status/sector filters" },
  { method: "GET", path: "/api/v1/tenders/:id", desc: "Get single tender with full bid history" },
  { method: "GET", path: "/api/v1/vendors/:address/score", desc: "Fetch on-chain reputation score for a vendor address" },
  { method: "GET", path: "/api/v1/contracts/:id/milestones", desc: "List all milestones and their verification status" },
  { method: "POST", path: "/api/v1/webhooks/subscribe", desc: "Subscribe to real-time contract events via webhook" },
  { method: "GET", path: "/api/v1/export/ocds/:tender_id", desc: "Export tender data in OCDS-compliant JSON format" },
];

const WEBHOOK_EVENTS = [
  "tender.created", "tender.bid_submitted", "tender.awarded",
  "escrow.funded", "milestone.verified", "milestone.released",
  "vendor.registered", "vendor.score_updated", "dispute.opened",
];

export default function ArchitecturePage() {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <PageShell>
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14">
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-3">Technical Reference</p>
            <h1 className={cn("text-5xl md:text-6xl font-black uppercase tracking-tight mb-4", isDark ? "text-white" : "text-slate-900")}>
              Technical <span className="text-yellow-400">Architecture</span>
            </h1>
            <p className={cn("text-base max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
              CivicLedger is a three-contract system deployed on Stellar Soroban Mainnet. Every component is open-source, audited, and designed for institutional-grade reliability.
            </p>
          </motion.div>

          {/* Architecture Diagram */}
          <div className={cn("p-8 rounded-3xl border mb-14", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-8">System Diagram</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-0">
              {/* Client */}
              <div className={cn("p-4 rounded-2xl border text-center w-full md:w-44", isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200")}>
                <Globe className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className={cn("font-black text-sm uppercase tracking-wide", isDark ? "text-white" : "text-slate-900")}>Browser / dApp</p>
                <p className="text-[10px] text-slate-500 mt-1">Next.js · Freighter</p>
              </div>

              <div className="flex flex-col items-center my-2 md:my-0 md:mx-2">
                <ArrowRight className="w-5 h-5 text-yellow-500 rotate-90 md:rotate-0" />
                <span className="text-[9px] text-slate-600 mt-1 font-mono">RPC / REST</span>
              </div>

              {/* Horizon */}
              <div className={cn("p-4 rounded-2xl border text-center w-full md:w-44", isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200")}>
                <Cpu className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className={cn("font-black text-sm uppercase tracking-wide", isDark ? "text-white" : "text-slate-900")}>Horizon API</p>
                <p className="text-[10px] text-slate-500 mt-1">Stellar · Mainnet</p>
              </div>

              <div className="flex flex-col items-center my-2 md:my-0 md:mx-2">
                <ArrowRight className="w-5 h-5 text-yellow-500 rotate-90 md:rotate-0" />
                <span className="text-[9px] text-slate-600 mt-1 font-mono">XDR</span>
              </div>

              {/* Soroban */}
              <div className={cn("p-4 rounded-2xl border text-center w-full md:w-56 relative", isDark ? "bg-yellow-500/5 border-yellow-500/30" : "bg-yellow-50 border-yellow-300")}>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-t-2xl" />
                <Network className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className={cn("font-black text-sm uppercase tracking-wide", isDark ? "text-white" : "text-slate-900")}>Soroban VM</p>
                <p className="text-[10px] text-yellow-500 mt-1 font-bold">3 Smart Contracts</p>
                <div className="mt-3 space-y-1">
                  {["TenderRegistry", "MilestoneEscrow", "VendorReputation"].map((c) => (
                    <div key={c} className={cn("text-[10px] font-mono px-2 py-0.5 rounded", isDark ? "bg-slate-800 text-slate-400" : "bg-white text-slate-500")}>
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center my-2 md:my-0 md:mx-2">
                <ArrowRight className="w-5 h-5 text-yellow-500 rotate-90 md:rotate-0" />
                <span className="text-[9px] text-slate-600 mt-1 font-mono">Ledger</span>
              </div>

              {/* Stellar Ledger */}
              <div className={cn("p-4 rounded-2xl border text-center w-full md:w-44", isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200")}>
                <Lock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className={cn("font-black text-sm uppercase tracking-wide", isDark ? "text-white" : "text-slate-900")}>Stellar Ledger</p>
                <p className="text-[10px] text-slate-500 mt-1">Immutable · Public</p>
              </div>
            </div>
          </div>

          {/* Contract Deep-Dives */}
          <div className="mb-14">
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-8">Smart Contracts</p>
            <div className="space-y-8">
              {CONTRACTS.map((contract, i) => (
                <motion.div
                  key={contract.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn("rounded-3xl border overflow-hidden", isDark ? "border-slate-800" : "border-slate-200")}
                >
                  {/* Contract header */}
                  <div className={cn("p-7 border-b", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                      <div className="flex-1">
                        <p className="text-[10px] font-mono text-slate-500 mb-1">{contract.tag}</p>
                        <h3 className={cn("text-2xl font-black tracking-tight uppercase mb-1", isDark ? "text-white" : "text-slate-900")}>{contract.name}</h3>
                        <p className="text-[11px] font-bold text-yellow-500 uppercase tracking-widest">{contract.language}</p>
                      </div>
                    </div>
                    <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{contract.desc}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Functions */}
                    <div className={cn("p-6 border-r", isDark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200")}>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Public Interface</p>
                      <div className="space-y-3">
                        {contract.functions.map((fn) => (
                          <div key={fn.sig} className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
                            <code className={cn("text-[11px] font-mono block mb-1.5", isDark ? "text-yellow-300" : "text-yellow-700")}>
                              {fn.sig}
                            </code>
                            <span className={cn("text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                              fn.access === "Public" ? "text-slate-400 bg-slate-400/10" :
                              fn.access.includes("Multi-Sig") ? "text-blue-400 bg-blue-400/10" :
                              "text-yellow-400 bg-yellow-400/10"
                            )}>
                              {fn.access}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Code snippet */}
                    <div className={cn("p-6", isDark ? "bg-[#0a0f1a]" : "bg-slate-900")}>
                      <div className="flex items-center gap-2 mb-4">
                        <Code2 className="w-4 h-4 text-yellow-400" />
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rust Implementation (excerpt)</p>
                      </div>
                      <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                        <code>{contract.code}</code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Security Model */}
          <div className="mb-14">
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-6">Security</p>
            <h2 className={cn("text-3xl font-black uppercase tracking-tight mb-8", isDark ? "text-white" : "text-slate-900")}>Security Model</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {SECURITY.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn("flex gap-4 p-6 rounded-2xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", isDark ? "bg-yellow-500/10" : "bg-yellow-50")}>
                    <s.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className={cn("font-black uppercase text-sm tracking-wide mb-2", isDark ? "text-white" : "text-slate-900")}>{s.title}</h4>
                    <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Integration Guide */}
          <div className={cn("rounded-3xl border overflow-hidden", isDark ? "border-slate-800" : "border-slate-200")}>
            <div className={cn("p-7 border-b", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
              <div className="flex items-center gap-3 mb-2">
                <Webhook className="w-5 h-5 text-yellow-400" />
                <h2 className={cn("text-2xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>Integration Guide</h2>
              </div>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                CivicLedger exposes a RESTful API and webhook system for integration with existing government financial management systems.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              {/* REST API */}
              <div className={cn("p-6 border-r", isDark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200")}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">REST API Endpoints</p>
                <div className="space-y-2">
                  {API_ENDPOINTS.map((ep) => (
                    <div key={ep.path} className={cn("flex items-start gap-3 p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded shrink-0 mt-0.5",
                        ep.method === "GET" ? "text-emerald-400 bg-emerald-400/10" : "text-yellow-400 bg-yellow-400/10"
                      )}>
                        {ep.method}
                      </span>
                      <div>
                        <code className={cn("text-[11px] font-mono block mb-0.5", isDark ? "text-white" : "text-slate-900")}>{ep.path}</code>
                        <p className="text-[11px] text-slate-500">{ep.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhook Events */}
              <div className={cn("p-6", isDark ? "bg-slate-900/50" : "bg-slate-50")}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">Webhook Events</p>
                <div className="grid grid-cols-1 gap-2 mb-6">
                  {WEBHOOK_EVENTS.map((ev) => (
                    <div key={ev} className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-yellow-400 shrink-0" />
                      <code className={cn("text-[12px] font-mono", isDark ? "text-slate-300" : "text-slate-700")}>{ev}</code>
                    </div>
                  ))}
                </div>
                <div className={cn("p-4 rounded-xl border", isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Example Payload</p>
                  <pre className={cn("text-[11px] font-mono overflow-x-auto", isDark ? "text-slate-300" : "text-slate-700")}>
{`{
  "event": "milestone.released",
  "contract_id": "CTR-2026-0029",
  "milestone_index": 3,
  "amount": 1350000,
  "asset": "USDC",
  "tx_hash": "0xd55b...7a19",
  "timestamp": 1747267200
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
