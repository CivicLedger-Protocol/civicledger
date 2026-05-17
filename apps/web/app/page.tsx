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

const LIVE_TENDERS = [
  { id: "CLG-2026-0847", ministry: "Ministry of Roads & Infrastructure", title: "Lagos-Ibadan Expressway Phase III", value: "₦48.2B", status: "BIDDING", bids: 7, deadline: "14d" },
  { id: "CLG-2026-0821", ministry: "Federal Ministry of Health", title: "National Medical Equipment Procurement", value: "₦12.8B", status: "AWARDED", vendor: "MedTech Solutions Ltd" },
  { id: "CLG-2026-0798", ministry: "Ministry of Education", title: "Universal Basic Education Infrastructure", value: "₦7.3B", status: "MILESTONE", progress: 67 },
  { id: "CLG-2026-0771", ministry: "Ministry of Power", title: "Rural Electrification Grid Expansion", value: "₦31.5B", status: "BIDDING", bids: 12, deadline: "7d" },
  { id: "CLG-2026-0743", ministry: "Federal Ministry of Finance", title: "ICT Infrastructure Modernization", value: "₦9.1B", status: "COMPLETED" },
  { id: "CLG-2026-0719", ministry: "Ministry of Agriculture", title: "Kaduna Irrigation System Phase 2", value: "₦5.8B", status: "MILESTONE", progress: 23 },
  { id: "CLG-2026-0697", ministry: "Ministry of Housing", title: "National Social Housing Programme", value: "₦22.4B", status: "BIDDING", bids: 4, deadline: "21d" },
];

const CORRUPTION_FACTS = [
  "$18B lost annually to procurement fraud in Sub-Saharan Africa",
  "73% of government contracts awarded without competitive bidding",
  "Average procurement dispute takes 4 years to resolve in courts",
  "Only 3% of developing nations have functioning e-procurement auditing",
  "$9.4B in unclaimed contractor overpayments identified in audits since 2020",
  "Procurement corruption represents 25% of total government budget leakage",
];

type Tender = typeof LIVE_TENDERS[number];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    BIDDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    AWARDED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    MILESTONE: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    COMPLETED: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  };
  return (
    <span className={cn("text-[7px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border", map[status] ?? "bg-slate-500/15 text-slate-400")}>
      {status}
    </span>
  );
}

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

      {/* HEADER — two-tier institutional government style */}
      <header className="fixed top-0 inset-x-0 z-50">
        {/* Tier 1: info strip */}
        <div className={cn(
          "h-8 flex items-center justify-between px-8 border-b text-[8px] font-mono uppercase tracking-[0.35em]",
          isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-300"
        )}>
          <div className="flex items-center gap-6">
            <span className={isDark ? "text-slate-600" : "text-slate-400"}>Open Government Procurement Protocol</span>
            <span className="w-px h-3 bg-slate-700 block" />
            <span className="text-yellow-500">Stellar Soroban · Mainnet</span>
          </div>
          <div className="flex items-center gap-6">
            <span className={isDark ? "text-slate-700" : "text-slate-400"}>Active Tenders: 142</span>
            <span className={isDark ? "text-slate-700" : "text-slate-400"}>Block #9,847,221</span>
          </div>
        </div>

        {/* Tier 2: main nav */}
        <div className={cn(
          "flex items-center h-14 border-b backdrop-blur-xl",
          isDark ? "bg-slate-950/93 border-slate-800" : "bg-white/97 border-slate-200"
        )}>
          {/* Logo — square icon + vertical accent + name */}
          <div className="flex items-center gap-0 px-8 border-r border-slate-800/60 h-full">
            <div className="w-8 h-8 bg-yellow-500 flex items-center justify-center mr-3">
              <Scale className="w-4 h-4 text-slate-900" />
            </div>
            <div className="border-l-2 border-yellow-500 pl-3">
              <span className={cn("font-black text-sm uppercase tracking-[0.18em] leading-none block", isDark ? "text-white" : "text-slate-900")}>
                CivicLedger
              </span>
              <span className="text-[6px] font-mono text-slate-500 uppercase tracking-[0.3em]">Procurement Protocol</span>
            </div>
          </div>

          {/* Nav with vertical dividers */}
          <nav className="hidden md:flex items-center flex-1 justify-center h-full">
            {[
              { label: "Tenders", href: "/tenders" },
              { label: "Vendors", href: "/vendors" },
              { label: "Transparency", href: "/transparency" },
              { label: "Solutions", href: "/solutions" },
              { label: "Roadmap", href: "/roadmap" },
            ].map((n, i) => (
              <div key={n.label} className="flex items-center h-full">
                {i > 0 && <div className={cn("w-px h-4 self-center", isDark ? "bg-slate-800" : "bg-slate-300")} />}
                <a href={n.href}
                  className={cn(
                    "px-6 h-full flex items-center text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-yellow-500 hover:bg-yellow-500/5",
                    isDark ? "text-slate-500" : "text-slate-500"
                  )}
                >{n.label}</a>
              </div>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3 px-6 ml-auto border-l border-slate-800/60 h-full">
            <ThemeToggle isDark={isDark} />
            {wallet.address ? (
              <button onClick={() => setWalletOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono font-bold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/15 transition-all">
                <span className="w-1.5 h-1.5 bg-yellow-400 animate-pulse" />
                {wallet.address.slice(0, 4)}…{wallet.address.slice(-4)}
              </button>
            ) : (
              <button onClick={() => setWalletOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors">
                <Wallet className="w-3.5 h-3.5" /> Connect
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO — Live Government Registry */}
      <section className="relative flex flex-col min-h-screen overflow-hidden" style={{ paddingTop: "88px" }}>

        {/* Main 2-panel layout */}
        <div className="flex flex-1">

          {/* LEFT: Public Notice editorial panel */}
          <div className={cn(
            "w-full lg:w-[46%] flex flex-col justify-center px-6 lg:px-14 py-16 lg:py-20 border-r",
            isDark ? "border-slate-800/50" : "border-slate-200"
          )}>
            {/* Official document mark */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-7 h-7 bg-yellow-500 flex items-center justify-center shrink-0">
                <Scale className="w-3.5 h-3.5 text-slate-900" />
              </div>
              <div className="h-px flex-1 bg-yellow-500/20" />
              <span className="text-[7px] font-mono text-yellow-500/70 tracking-[0.45em] uppercase whitespace-nowrap">
                Open Procurement Record
              </span>
              <div className="h-px flex-1 bg-yellow-500/20" />
            </div>

            {/* Issue metadata */}
            <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 mb-8 text-[8px] font-mono uppercase tracking-widest", isDark ? "text-slate-700" : "text-slate-400")}>
              <span>Block #9,847,221</span>
              <span className="text-slate-800">·</span>
              <span className="text-yellow-500/80">142 Active Tenders</span>
              <span className="text-slate-800">·</span>
              <span>$91M Tracked</span>
            </div>

            {/* MAIN STATEMENT — editorial, not marketing */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-black leading-[1.05] tracking-tight mb-6">
                <div className={cn("text-xl md:text-2xl font-medium mb-1", isDark ? "text-slate-500" : "text-slate-400")}>
                  ₦2.4 trillion in public contracts.
                </div>
                <div className={cn("text-3xl md:text-4xl lg:text-5xl", isDark ? "text-white" : "text-slate-900")}>
                  How much was<br />stolen this year?
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl text-yellow-400 mt-1">
                  CivicLedger shows you.
                </div>
              </h1>

              <p className={cn("text-sm leading-[1.8] mb-8 max-w-md", isDark ? "text-slate-400" : "text-slate-600")}>
                Every public tender, every bid, every contract award, every milestone payment — recorded immutably on Stellar Soroban. Verified by cryptographic proof, not political promise.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={() => setWalletOpen(true)}
                  className="flex items-center gap-2 px-7 py-3.5 font-black uppercase text-[11px] tracking-widest bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                  Access Registry <ArrowRight className="w-4 h-4" />
                </button>
                <a href="#protocol"
                  className={cn("flex items-center gap-2 px-7 py-3.5 font-bold uppercase text-[11px] tracking-widest border transition-all",
                    isDark ? "border-slate-700 text-slate-400 hover:border-yellow-500/30 hover:text-white" : "border-slate-300 text-slate-600")}>
                  View Architecture
                </a>
              </div>
            </motion.div>

            {/* Compact stats */}
            <div className={cn("grid grid-cols-2 gap-px border", isDark ? "border-slate-800 bg-slate-800" : "border-slate-200 bg-slate-200")}>
              {STATS.map((s) => (
                <div key={s.label} className={cn("p-4", isDark ? "bg-slate-950" : "bg-white")}>
                  <div className={cn("text-2xl font-black leading-none mb-1", isDark ? "text-white" : "text-slate-900")}>{s.value}</div>
                  <div className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Live Tender Board */}
          <div className={cn("hidden lg:flex lg:w-[54%] flex-col", isDark ? "bg-[#060a11]" : "bg-slate-50")}>
            {/* Board header */}
            <div className={cn("flex items-center justify-between px-6 py-3 border-b shrink-0", isDark ? "border-slate-800/60" : "border-slate-200")}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-[8px] font-mono text-yellow-400 tracking-[0.4em] uppercase">Live Procurement Board</span>
              </div>
              <span className="text-[7px] font-mono text-slate-700">Updated 2s ago · Stellar Mainnet</span>
            </div>

            {/* Column headers */}
            <div className={cn("grid grid-cols-[1fr_80px_90px] gap-3 px-6 py-2 border-b text-[7px] font-mono uppercase tracking-[0.3em] shrink-0",
              isDark ? "border-slate-800/40 text-slate-700" : "border-slate-200 text-slate-400")}>
              <span>Tender / Ministry</span><span className="text-right">Value</span><span className="text-right">Status</span>
            </div>

            {/* Tender rows */}
            <div className="flex-1 overflow-hidden divide-y divide-slate-800/20">
              {LIVE_TENDERS.map((tender, i) => (
                <motion.div
                  key={tender.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className={cn(
                    "grid grid-cols-[1fr_80px_90px] gap-3 px-6 py-4 items-start group transition-colors cursor-pointer",
                    isDark ? "hover:bg-yellow-500/3" : "hover:bg-yellow-50/50"
                  )}
                >
                  <div className="min-w-0">
                    <div className={cn("text-[9px] font-mono mb-0.5 truncate", isDark ? "text-slate-600" : "text-slate-400")}>
                      {tender.id}
                    </div>
                    <div className={cn("text-xs font-bold truncate mb-0.5", isDark ? "text-white" : "text-slate-900")}>
                      {tender.title}
                    </div>
                    <div className={cn("text-[9px] truncate", isDark ? "text-slate-500" : "text-slate-500")}>
                      {tender.ministry}
                    </div>
                    {'progress' in tender && tender.progress !== undefined && (
                      <div className={cn("mt-1.5 h-1 rounded-full overflow-hidden", isDark ? "bg-slate-800" : "bg-slate-200")}>
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${tender.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <div className={cn("text-right text-[11px] font-black font-mono pt-4", isDark ? "text-white" : "text-slate-900")}>
                    {tender.value}
                  </div>
                  <div className="text-right pt-4">
                    <StatusBadge status={tender.status} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Board footer */}
            <div className={cn("px-6 py-3 border-t flex items-center justify-between shrink-0",
              isDark ? "border-slate-800/60" : "border-slate-200")}>
              <span className="text-[7px] font-mono text-slate-700">142 active · 891 total · $91M tracked</span>
              <button onClick={() => setWalletOpen(true)}
                className="text-[8px] font-mono text-yellow-500/70 hover:text-yellow-400 transition-colors uppercase tracking-widest">
                View All →
              </button>
            </div>
          </div>
        </div>

        {/* Full-width corruption facts ticker */}
        <div className={cn("border-t h-8 flex items-center overflow-hidden shrink-0", isDark ? "border-slate-800/50" : "border-slate-200")}>
          <motion.div
            className="flex items-center gap-12 whitespace-nowrap px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {[...CORRUPTION_FACTS, ...CORRUPTION_FACTS].map((fact, i) => (
              <span key={i} className={cn("text-[8px] font-mono tracking-widest", isDark ? "text-slate-700" : "text-slate-400")}>
                {fact} <span className="text-yellow-500/30 mx-2">◆</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* THE SCALE SECTION */}
      <section className={cn("border-t py-20 px-6", isDark ? "border-slate-800/50" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-[9px] font-mono text-yellow-500 uppercase tracking-[0.5em] mb-3">The Problem</p>
            <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              Procurement corruption is not an accident.<br />
              <span className="text-yellow-400">It's the default state without accountability infrastructure.</span>
            </h2>
          </div>
          <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-px border", isDark ? "bg-slate-800/50 border-slate-800" : "bg-slate-200 border-slate-200")}>
            {[
              { value: "$18B", label: "Lost annually to procurement fraud in sub-Saharan Africa", note: "World Bank, 2024" },
              { value: "73%", label: "Of government contracts awarded without competitive bidding", note: "Transparency Int'l" },
              { value: "18mo", label: "Average time for a procurement dispute to resolve in court", note: "OECD Report" },
              { value: "0", label: "Blockchain-native public procurement transparency systems before CivicLedger", note: "Our research" },
            ].map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn("p-6 flex flex-col", isDark ? "bg-slate-950" : "bg-white")}
              >
                <div className="text-4xl md:text-5xl font-black text-yellow-400 mb-3 leading-none">{stat.value}</div>
                <p className={cn("text-xs leading-relaxed flex-1 mb-3", isDark ? "text-slate-400" : "text-slate-600")}>{stat.label}</p>
                <div className="text-[7px] font-mono text-slate-700 uppercase tracking-widest">{stat.note}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROTOCOL ARCHITECTURE */}
      <section id="protocol" className={cn("border-t py-20 px-6", isDark ? "border-slate-800/50" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[9px] font-mono text-yellow-500 uppercase tracking-[0.5em] mb-3">Architecture</p>
            <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              Three contracts. One unbreakable chain.<br />
              <span className="text-yellow-400">From tender to payment — no human discretion required.</span>
            </h2>
          </div>

          {/* Connected flow */}
          <div className="relative">
            <div className={cn("absolute top-8 left-[16.5%] right-[16.5%] h-px hidden md:block",
              isDark ? "bg-gradient-to-r from-yellow-500/30 via-amber-500/40 to-yellow-500/30" : "bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300")} />
            <div className="grid md:grid-cols-3 gap-6">
              {MODULES.map((m, i) => (
                <motion.div key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={cn("p-6 border relative transition-all hover:shadow-xl group",
                    isDark ? "bg-slate-900 border-slate-800 hover:border-yellow-500/40" : "bg-white border-slate-200 hover:border-yellow-400")}>
                  <div className={cn("absolute -top-3 left-5 text-[8px] font-mono px-2 py-0.5 border",
                    isDark ? "bg-slate-950 border-slate-800 text-slate-600" : "bg-white border-slate-200 text-slate-500")}>
                    0{i + 1}
                  </div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-10 h-10 flex items-center justify-center", isDark ? "bg-yellow-500/10" : "bg-yellow-50")}>
                      <m.icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className={cn("text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border",
                      isDark ? "border-yellow-500/20 text-yellow-500/80 bg-yellow-500/5" : "border-yellow-300 text-yellow-700 bg-yellow-50")}>
                      {m.badge}
                    </span>
                  </div>
                  <div className="text-[8px] font-mono text-slate-600 mb-1 tracking-wider">{m.tag}</div>
                  <h3 className={cn("text-lg font-black uppercase tracking-tight mb-2", isDark ? "text-white" : "text-slate-900")}>{m.title}</h3>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIFECYCLE TIMELINE */}
      <section className={cn("border-t py-20 px-6", isDark ? "border-slate-800/50" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[9px] font-mono text-yellow-500 uppercase tracking-[0.5em] mb-3">Lifecycle</p>
            <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              The complete procurement pipeline.<br />
              <span className="text-yellow-400">Every stage verifiable. No dark rooms.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4 relative">
            <div className={cn("absolute top-6 left-[12%] right-[12%] h-px hidden md:block", isDark ? "bg-slate-800" : "bg-slate-200")} />
            {LIFECYCLE.map((stage, i) => (
              <motion.div key={stage.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative">
                <div className="flex flex-col items-start">
                  <div className="w-12 h-12 bg-yellow-500 flex items-center justify-center mb-4 relative z-10 shrink-0">
                    <span className="text-sm font-black text-slate-900">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className={cn("font-black uppercase text-sm tracking-wide mb-2", isDark ? "text-white" : "text-slate-900")}>{stage.label}</h3>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Government Partners */}
      <section className={cn("border-t py-20 px-6", isDark ? "border-slate-800/50" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto">
          <div className={cn("border overflow-hidden", isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white")}>
            <div className="grid md:grid-cols-[1fr_auto]">
              <div className="p-10 md:p-14">
                <p className="text-[8px] font-mono text-yellow-500 uppercase tracking-[0.5em] mb-4">Open Infrastructure</p>
                <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight mb-5", isDark ? "text-white" : "text-slate-900")}>
                  Built for governments.<br />
                  <span className="text-yellow-400">Open to the world.</span>
                </h2>
                <p className={cn("text-sm leading-relaxed mb-8 max-w-lg", isDark ? "text-slate-400" : "text-slate-600")}>
                  CivicLedger is MIT-licensed infrastructure any municipality, NGO, or transparency watchdog can deploy. The protocol is open-source — the accountability is structural.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setWalletOpen(true)}
                    className="flex items-center gap-2 px-7 py-3.5 font-black uppercase text-[11px] tracking-widest bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                    <Wallet className="w-4 h-4" /> Connect Wallet
                  </button>
                  <a href="https://github.com/CivicLedger-Protocol/civicledger" target="_blank" rel="noopener noreferrer"
                    className={cn("flex items-center gap-2 px-7 py-3.5 font-bold uppercase text-[11px] tracking-widest border transition-all",
                      isDark ? "border-slate-700 text-slate-400 hover:border-yellow-500/30 hover:text-white" : "border-slate-300 text-slate-600")}>
                    <GitBranch className="w-4 h-4" /> GitHub
                  </a>
                </div>
              </div>
              <div className={cn("hidden md:flex flex-col divide-y min-w-[240px] border-l",
                isDark ? "divide-slate-800 border-slate-800" : "divide-slate-200 border-slate-200")}>
                {[
                  { icon: ShieldCheck, label: "Soroban Authorization", desc: "Role-based access on-chain" },
                  { icon: Lock, label: "Immutable Audit Trail", desc: "Cryptographic permanence" },
                  { icon: Globe, label: "OCDS Compatible", desc: "International standard" },
                  { icon: Users, label: "Multi-Sig Oversight", desc: "Distributed verification" },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3 px-6 py-4">
                    <div className="w-8 h-8 bg-yellow-500/10 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className={cn("font-bold text-xs", isDark ? "text-white" : "text-slate-900")}>{f.label}</p>
                      <p className="text-[9px] text-slate-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={cn("border-t px-6 py-10", isDark ? "border-slate-800" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 flex items-center justify-center">
              <Scale className="w-4 h-4 text-slate-900" />
            </div>
            <div className="border-l-2 border-yellow-500 pl-3">
              <span className={cn("font-black text-sm uppercase tracking-[0.15em]", isDark ? "text-white" : "text-slate-900")}>CivicLedger</span>
              <span className={cn("text-[8px] block font-mono uppercase tracking-[0.3em]", isDark ? "text-slate-600" : "text-slate-500")}>Public Procurement Protocol</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {["GitHub", "Twitter", "Discord", "Docs"].map(l => (
              <a key={l} href="#" className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-yellow-400", isDark ? "text-slate-600" : "text-slate-500")}>{l}</a>
            ))}
          </div>
          <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">© 2026 CivicLedger Protocol · MIT</p>
        </div>
      </footer>
    </div>
  );
}
