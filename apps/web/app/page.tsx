"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Landmark, FileText, Scale, ShieldCheck, Users, ArrowRight,
  Moon, Sun, Wallet, X, ChevronRight, AlertCircle, Zap,
  Lock, Globe, Network, GitBranch, Award, BarChart3, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    freighter?: {
      isConnected: () => Promise<boolean>;
      getAddress: () => Promise<{ address: string } | { error: string }>;
      getNetwork: () => Promise<{ network: string; networkPassphrase: string } | { error: string }>;
      requestAccess: () => Promise<{ address: string } | { error: string }>;
    };
  }
}

const MAINNET_PASSPHRASE = "Public Global Stellar Network ; September 2015";

function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (!window.freighter) {
        window.open("https://freighter.app", "_blank");
        setError("Freighter not found. Install it to continue.");
        return;
      }
      const result = await window.freighter.requestAccess();
      if ("error" in result) throw new Error(result.error);
      const net = await window.freighter.getNetwork();
      if ("error" in net) throw new Error(net.error);
      if (net.networkPassphrase !== MAINNET_PASSPHRASE) {
        setError("Switch to Stellar Mainnet in Freighter settings.");
        return;
      }
      setAddress(result.address);
    } catch (err: any) {
      setError(err.message || "Connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => setAddress(null);
  return { address, isConnecting, error, connect, disconnect };
}

const ThemeToggle = ({ isDark }: { isDark: boolean }) => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
        isDark ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20" : "bg-amber-50 border-amber-200 hover:bg-amber-100"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sun className="w-4 h-4 text-amber-400" />
          </motion.span>
        ) : (
          <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Moon className="w-4 h-4 text-slate-700" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

const WalletModal = ({ isOpen, onClose, wallet }: {
  isOpen: boolean; onClose: () => void; wallet: ReturnType<typeof useWallet>;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-7 shadow-2xl"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-t-2xl" />
          <div className="flex items-center justify-between mb-7">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Connect Wallet</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-1">Stellar · Mainnet Only</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {wallet.error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">{wallet.error}</p>
            </div>
          )}

          {wallet.address ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <p className="text-[10px] text-yellow-400 uppercase tracking-widest font-bold">Connected · Mainnet</p>
                </div>
                <p className="font-mono text-xs text-white break-all leading-relaxed">{wallet.address}</p>
              </div>
              <button
                onClick={() => { wallet.disconnect(); onClose(); }}
                className="w-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={wallet.connect}
              disabled={wallet.isConnecting}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-500/30 transition-all text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                <Wallet className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="font-black text-white uppercase text-sm tracking-wide">Freighter</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Official Stellar Extension</p>
              </div>
              {wallet.isConnecting
                ? <div className="w-5 h-5 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                : <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-yellow-400 transition-colors" />
              }
            </button>
          )}
          <p className="text-center text-[10px] text-slate-700 mt-5 uppercase tracking-widest">Soroban · CivicLedger Protocol</p>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const STATS = [
  { label: "Active Tenders", value: "142", icon: FileText, color: "text-yellow-400" },
  { label: "Total Value Locked", value: "$91M", icon: TrendingUp, color: "text-amber-400" },
  { label: "Verified Vendors", value: "1,840", icon: Award, color: "text-yellow-300" },
  { label: "Trust Index", value: "A+", icon: Scale, color: "text-amber-300" },
];

const MODULES = [
  {
    icon: FileText,
    title: "Tender Registry",
    tag: "contracts/tender-registry",
    badge: "OCDS Compliant",
    desc: "The authoritative on-chain source for all public tenders. Supports Open Contracting Data Standard (OCDS) for seamless integration with existing government systems. Manages transitions across Open → Bidding → Awarded → Completed states.",
  },
  {
    icon: Landmark,
    title: "Milestone Escrow",
    tag: "contracts/milestone-escrow",
    badge: "Multi-Sig",
    desc: "A high-integrity disbursement engine that locks project capital and releases tranches only upon cryptographic verification of specific deliverables—requiring signatures from both government auditors and independent inspectors.",
  },
  {
    icon: Award,
    title: "Vendor Reputation",
    tag: "contracts/vendor-reputation",
    badge: "Non-Transferable",
    desc: "An objective, soulbound reputation system tracking contractor delivery history. On-time completions earn credits. Delays and breaches incur automatic penalties. The most trustworthy suppliers rise—naturally.",
  },
];

const LIFECYCLE = [
  { label: "Solicitation", desc: "Government entity creates a compliant tender on-chain with full budget, scope, and timeline encoded." },
  { label: "Competitive Bid", desc: "Verified contractors submit encrypted bids. Opening is triggered automatically at the deadline—no human intervention." },
  { label: "Award & Escrow", desc: "The winning bid triggers contract creation. Project funds are locked in the Milestone Escrow pending delivery." },
  { label: "Performance Release", desc: "As deliverables are verified by multi-sig auditors, funds are released in tranches. Vendor reputation is updated." },
];

export default function CivicLedgerPage() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wallet = useWallet();
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme !== "light";

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
    )}>
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={cn("absolute inset-0", isDark ? "bg-[#080c14]" : "bg-slate-100")} />
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-yellow-900/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-5 bg-yellow-500" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-5 bg-amber-600" />
        {/* Institutional grid lines */}
        <div className={cn(
          "absolute inset-0",
          isDark
            ? "bg-[linear-gradient(rgba(234,179,8,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"
            : "bg-[linear-gradient(rgba(100,100,100,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,0.06)_1px,transparent_1px)] bg-[size:80px_80px]"
        )} />
      </div>

      <WalletModal isOpen={walletOpen} onClose={() => setWalletOpen(false)} wallet={wallet} />

      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className={cn(
          "mx-4 mt-4 flex items-center justify-between px-5 py-3 rounded-2xl border backdrop-blur-xl",
          isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/90 border-slate-300"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Scale className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <span className={cn("font-black text-lg uppercase tracking-tight leading-none block", isDark ? "text-white" : "text-slate-900")}>CivicLedger</span>
              <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-[0.4em]">Soroban · Mainnet</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Tenders", href: "/tenders" },
              { label: "Vendors", href: "/vendors" },
              { label: "Transparency", href: "/transparency" },
              { label: "Solutions", href: "/solutions" },
              { label: "Roadmap", href: "/roadmap" },
            ].map(n => (
              <a key={n.label} href={n.href}
                className={cn("text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-yellow-500",
                  isDark ? "text-slate-500" : "text-slate-500")}
              >{n.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} />
            {wallet.address ? (
              <button
                onClick={() => setWalletOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="font-mono">{wallet.address.slice(0, 4)}…{wallet.address.slice(-4)}</span>
              </button>
            ) : (
              <button
                onClick={() => setWalletOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all"
              >
                <Wallet className="w-3.5 h-3.5" /> Connect
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={cn(
              "inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.5em] mb-10 border",
              isDark ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-400" : "bg-yellow-50 border-yellow-300 text-yellow-700"
            )}>
              <ShieldCheck className="w-3.5 h-3.5" />
              Public Procurement · On-Chain
            </div>

            <h1 className={cn(
              "text-[4.5rem] md:text-[8rem] lg:text-[11rem] font-black leading-[0.82] tracking-[-0.04em] uppercase mb-10",
              isDark ? "text-white" : "text-slate-900"
            )}>
              Transparency<br />
              Is The<br />
              <span className="text-yellow-400">Foundation.</span>
            </h1>

            <p className={cn(
              "text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-14 font-medium",
              isDark ? "text-slate-400" : "text-slate-600"
            )}>
              CivicLedger brings immutable accountability to every dollar of public spending.
              From tender issuance to final payment—<strong className={isDark ? "text-white" : "text-slate-900"}>every stage on-chain, every action auditable, forever.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setWalletOpen(true)}
                className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm bg-yellow-500 text-slate-900 shadow-xl shadow-yellow-500/20 hover:bg-yellow-400 transition-all"
              >
                Access Registry <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#tenders" className={cn(
                "flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm border transition-all",
                isDark ? "border-slate-700 text-slate-400 hover:border-yellow-500/30 hover:text-white" : "border-slate-300 text-slate-600 hover:border-yellow-400"
              )}>
                View Architecture
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-5 rounded-2xl border transition-all group",
                isDark
                  ? "bg-slate-900/60 border-slate-800 hover:border-yellow-500/30"
                  : "bg-white border-slate-200 hover:border-yellow-400"
              )}
            >
              <s.icon className={cn("w-5 h-5 mb-3", s.color)} />
              <div className={cn("text-3xl font-black tracking-tight mb-1", isDark ? "text-white" : "text-slate-900")}>{s.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section id="tenders" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-4">Architecture</p>
            <h2 className={cn("text-4xl md:text-5xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              Three Modules.<br />
              <span className="text-yellow-400">One Standard of Truth.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {MODULES.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={cn(
                  "p-7 rounded-2xl border transition-all hover:shadow-xl",
                  isDark ? "bg-slate-900 border-slate-800 hover:border-yellow-500/30" : "bg-white border-slate-200 hover:border-yellow-400"
                )}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isDark ? "bg-yellow-500/10" : "bg-yellow-50")}>
                    <m.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border", isDark ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/5" : "border-yellow-300 text-yellow-700 bg-yellow-50")}>
                    {m.badge}
                  </span>
                </div>
                <div className="text-[9px] font-mono text-slate-500 mb-2 tracking-wider">{m.tag}</div>
                <h3 className={cn("text-xl font-black uppercase tracking-tight mb-3", isDark ? "text-white" : "text-slate-900")}>{m.title}</h3>
                <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIFECYCLE */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-4">Lifecycle</p>
            <h2 className={cn("text-4xl md:text-5xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              The Procurement<br />
              <span className="text-yellow-400">Pipeline.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {LIFECYCLE.map((stage, i) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={cn(
                  "p-6 rounded-2xl border transition-all",
                  isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black text-slate-900">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className={cn("h-px flex-1", isDark ? "bg-slate-700" : "bg-slate-200")} />
                </div>
                <h3 className={cn("font-black uppercase text-sm tracking-wide mb-2", isDark ? "text-white" : "text-slate-900")}>{stage.label}</h3>
                <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{stage.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className={cn(
          "max-w-5xl mx-auto rounded-3xl border overflow-hidden",
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <div className="grid md:grid-cols-2">
            <div className={cn("p-12 border-r", isDark ? "border-slate-800" : "border-slate-200")}>
              <h2 className={cn("text-4xl md:text-5xl font-black uppercase tracking-tight mb-6", isDark ? "text-white" : "text-slate-900")}>
                Public Goods.<br />
                <span className="text-yellow-400">Public Ledger.</span>
              </h2>
              <p className={cn("text-sm leading-relaxed mb-8", isDark ? "text-slate-400" : "text-slate-600")}>
                Every government contract recorded with cryptographic finality. CivicLedger is open-source infrastructure that any municipality, NGO, or international body can deploy.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setWalletOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all"
                >
                  <Wallet className="w-4 h-4" /> Connect
                </button>
                <a href="https://github.com/CivicLedger-Protocol/CivicLedger" target="_blank" rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm border transition-all",
                    isDark ? "border-slate-700 text-slate-400 hover:border-yellow-500/30 hover:text-white" : "border-slate-300 text-slate-600"
                  )}>
                  <GitBranch className="w-4 h-4" /> GitHub
                </a>
              </div>
            </div>
            <div className="p-12">
              <div className={cn("text-[10px] font-mono uppercase tracking-widest mb-6", isDark ? "text-slate-600" : "text-slate-500")}>Security Model</div>
              {[
                { icon: ShieldCheck, label: "Soroban Native Authorization", desc: "Only designated officials can interact with protected functions." },
                { icon: Lock, label: "Immutable Audit Trail", desc: "Every action timestamped and permanently recorded on Stellar." },
                { icon: Globe, label: "OCDS Compatible", desc: "Open Contracting Data Standard for international interoperability." },
                { icon: Users, label: "Multi-Sig Oversight", desc: "Key actions require consensus across government and auditor keys." },
              ].map(f => (
                <div key={f.label} className={cn("flex gap-3 mb-5 pb-5 border-b last:border-b-0 last:mb-0 last:pb-0", isDark ? "border-slate-800" : "border-slate-100")}>
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <f.icon className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className={cn("font-bold text-sm mb-0.5", isDark ? "text-white" : "text-slate-900")}>{f.label}</p>
                    <p className="text-xs text-slate-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={cn("border-t px-6 py-12", isDark ? "border-slate-800" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-yellow-500 flex items-center justify-center">
              <Scale className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <span className={cn("font-black text-base uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>CivicLedger</span>
              <span className={cn("text-[10px] block uppercase tracking-widest", isDark ? "text-slate-600" : "text-slate-500")}>Public Procurement Protocol</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {["GitHub", "Twitter", "Discord", "Docs"].map(l => (
              <a key={l} href="#" className={cn("text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-yellow-400", isDark ? "text-slate-500" : "text-slate-500")}>{l}</a>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">© 2026 CivicLedger Protocol · MIT</p>
        </div>
      </footer>
    </div>
  );
}
