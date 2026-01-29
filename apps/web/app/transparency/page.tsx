"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  ShieldCheck, Lock, Globe, TrendingDown, ExternalLink,
  CheckCircle2, BarChart3, Clock, Banknote, FileText,
} from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Total Procurement on Platform", value: "$91.2M", icon: Banknote, color: "text-yellow-400" },
  { label: "Funds Disbursed", value: "$67.4M", icon: TrendingDown, color: "text-emerald-400" },
  { label: "Active Contracts", value: "89", icon: FileText, color: "text-amber-400" },
  { label: "Avg Milestone Completion", value: "11.3 Days", icon: Clock, color: "text-yellow-300" },
];

const FEED = [
  { date: "2026-05-15", contract: "Municipal Water Treatment — Lagos", milestone: "Foundation Works Complete", amount: "$875,000", authorizedBy: "Min. Works & Housing", txHash: "0xa3f9…d1c2" },
  { date: "2026-05-14", contract: "National Highway Rehab — Phase III", milestone: "Asphalt Layer — Segment 4", amount: "$2,100,000", authorizedBy: "Infrastructure Audit Office", txHash: "0xb72e…9f44" },
  { date: "2026-05-13", contract: "Digital Identity System", milestone: "Backend API Deployment", amount: "$420,000", authorizedBy: "NITA Technical Committee", txHash: "0xc81a…3e77" },
  { date: "2026-05-12", contract: "School Construction — Abuja FCT", milestone: "Block A Superstructure", amount: "$1,350,000", authorizedBy: "UBEC Monitoring Team", txHash: "0xd55b…7a19" },
  { date: "2026-05-11", contract: "Renewable Energy Grid — Kano", milestone: "Substation Installation", amount: "$980,000", authorizedBy: "Rural Electrification Agency", txHash: "0xe29c…2b88" },
  { date: "2026-05-10", contract: "Urban Transport Fleet", milestone: "Batch 2 Delivery — 40 Buses", amount: "$3,600,000", authorizedBy: "LAMATA Procurement Unit", txHash: "0xf14d…6c31" },
  { date: "2026-05-09", contract: "Healthcare Supply Chain", milestone: "Cold Chain Equipment Install", amount: "$560,000", authorizedBy: "FMH Audit Committee", txHash: "0x0a3e…4f90" },
  { date: "2026-05-08", contract: "Port Logistics System", milestone: "Data Migration Complete", amount: "$190,000", authorizedBy: "NPA Technology Board", txHash: "0x1b7f…8d05" },
  { date: "2026-05-07", contract: "National Highway Rehab — Phase III", milestone: "Drainage Infrastructure", amount: "$1,750,000", authorizedBy: "Infrastructure Audit Office", txHash: "0x2c8a…1e64" },
  { date: "2026-05-06", contract: "EduBuild Schools — Rivers State", milestone: "Roofing & Finishing — 30 Units", amount: "$2,250,000", authorizedBy: "SUBEB State Director", txHash: "0x3d91…5b27" },
];

const SAVINGS = [
  { label: "Average Cost Savings", value: "23%", desc: "vs. traditional procurement processes" },
  { label: "Reduced Disbursement Time", value: "68%", desc: "from months to days with smart escrow" },
  { label: "Dispute Rate", value: "1.2%", desc: "vs. 14% industry average" },
  { label: "Audit Cost Reduction", value: "41%", desc: "automated compliance verification" },
];

export default function TransparencyPage() {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <PageShell>
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em]">On-Chain Accountability</p>
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> OCDS Compliant
              </span>
            </div>
            <h1 className={cn("text-5xl md:text-6xl font-black uppercase tracking-tight mb-4", isDark ? "text-white" : "text-slate-900")}>
              Public Financial <span className="text-yellow-400">Ledger</span>
            </h1>
            <p className={cn("text-base max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
              Every fund movement, milestone approval, and disbursement authorization — recorded permanently on Stellar. No redactions. No amendments. Immutable public record.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className={cn("p-5 rounded-2xl border", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
                <s.icon className={cn("w-5 h-5 mb-3", s.color)} />
                <div className={cn("text-2xl font-black tracking-tight mb-1", isDark ? "text-white" : "text-slate-900")}>{s.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Live Feed */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className={cn("text-xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>Live Transaction Feed</h2>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-slate-600" : "text-slate-400")}>· Real-time milestone disbursements</span>
            </div>
            <div className={cn("rounded-2xl border overflow-hidden", isDark ? "border-slate-800" : "border-slate-200")}>
              <div className={cn("hidden md:grid grid-cols-6 gap-4 px-5 py-3 text-[10px] font-bold uppercase tracking-widest border-b", isDark ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400")}>
                <span>Date</span>
                <span className="col-span-2">Contract / Milestone</span>
                <span>Amount</span>
                <span>Authorized By</span>
                <span>TX Hash</span>
              </div>
              {FEED.map((row, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className={cn("grid md:grid-cols-6 grid-cols-1 gap-2 md:gap-4 px-5 py-4 border-b last:border-b-0 transition-colors", isDark ? "border-slate-800/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50")}>
                  <span className="text-xs font-mono text-slate-500">{row.date}</span>
                  <div className="md:col-span-2">
                    <p className={cn("text-xs font-bold leading-tight", isDark ? "text-white" : "text-slate-900")}>{row.contract}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{row.milestone}</p>
                  </div>
                  <span className={cn("text-sm font-black", isDark ? "text-yellow-400" : "text-yellow-600")}>{row.amount}</span>
                  <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-600")}>{row.authorizedBy}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono text-slate-500">{row.txHash}</span>
                    <ExternalLink className="w-3 h-3 text-slate-600 hover:text-yellow-400 cursor-pointer transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className={cn("p-7 rounded-2xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
              <div className="flex items-center gap-3 mb-5">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-yellow-500/10" : "bg-yellow-50")}>
                  <Lock className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className={cn("font-black uppercase text-base tracking-tight", isDark ? "text-white" : "text-slate-900")}>Immutable Audit Trail</h3>
              </div>
              <p className={cn("text-sm leading-relaxed mb-5", isDark ? "text-slate-400" : "text-slate-600")}>
                Every action in CivicLedger is permanently inscribed on the Stellar blockchain. Once a transaction is confirmed, it cannot be altered, deleted, or obscured — by any party.
              </p>
              {[
                { icon: ShieldCheck, text: "Every approval carries cryptographic signatures from authorized signatories" },
                { icon: Lock, text: "Ledger state is deterministic — any node can independently verify the full history" },
                { icon: Globe, text: "Public export available in JSON, CSV, and OCDS-compliant XML formats" },
                { icon: BarChart3, text: "Automated anomaly detection flags statistical outliers for review" },
              ].map((item, i) => (
                <div key={i} className={cn("flex items-start gap-3 mb-4 last:mb-0", i < 3 && "pb-4 border-b", isDark ? "border-slate-800" : "border-slate-100")}>
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", isDark ? "bg-slate-800" : "bg-slate-100")}>
                    <item.icon className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{item.text}</p>
                </div>
              ))}
            </div>

            <div className={cn("p-7 rounded-2xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
              <div className="flex items-center gap-3 mb-5">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-yellow-500/10" : "bg-yellow-50")}>
                  <TrendingDown className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className={cn("font-black uppercase text-base tracking-tight", isDark ? "text-white" : "text-slate-900")}>Procurement Savings</h3>
              </div>
              <p className={cn("text-sm leading-relaxed mb-5", isDark ? "text-slate-400" : "text-slate-600")}>
                Independent analyses of on-chain vs. traditional procurement cycles show consistent efficiency gains. The 23% average cost saving is auditor-verified.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SAVINGS.map((s) => (
                  <div key={s.label} className={cn("p-4 rounded-xl border", isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200")}>
                    <div className="text-3xl font-black text-yellow-400 mb-1">{s.value}</div>
                    <p className={cn("text-xs font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>{s.label}</p>
                    <p className="text-[11px] text-slate-500">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={cn("flex items-center gap-5 p-6 rounded-2xl border", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
            <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center shrink-0 shadow-lg shadow-yellow-500/20">
              <Globe className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h4 className={cn("font-black uppercase text-sm tracking-wide mb-1", isDark ? "text-white" : "text-slate-900")}>
                OCDS Compliant · Open Contracting Data Standard v1.1.5
              </h4>
              <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                All procurement data published by CivicLedger conforms to the Open Contracting Partnership global standard, enabling seamless integration with existing government financial management systems, donor platforms, and civil society monitoring tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
