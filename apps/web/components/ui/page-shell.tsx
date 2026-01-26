"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Scale, Moon, Sun, Wallet, X, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => setAddress(null);
  return { address, isConnecting, error, connect, disconnect };
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Tenders", href: "/tenders" },
  { label: "Vendors", href: "/vendors" },
  { label: "Transparency", href: "/transparency" },
  { label: "Solutions", href: "/solutions" },
  { label: "Roadmap", href: "/roadmap" },
];

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
        isDark
          ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20"
          : "bg-amber-50 border-amber-200 hover:bg-amber-100"
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

const WalletModal = ({
  isOpen,
  onClose,
  wallet,
}: {
  isOpen: boolean;
  onClose: () => void;
  wallet: ReturnType<typeof useWallet>;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        />
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
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
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
              {wallet.isConnecting ? (
                <div className="w-5 h-5 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-yellow-400 transition-colors" />
              )}
            </button>
          )}
          <p className="text-center text-[10px] text-slate-700 mt-5 uppercase tracking-widest">
            Soroban · CivicLedger Protocol
          </p>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function PageShell({ children }: { children: React.ReactNode }) {
  const [walletOpen, setWalletOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wallet = useWallet();
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme !== "light";

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500",
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
      )}
    >
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={cn("absolute inset-0", isDark ? "bg-[#080c14]" : "bg-slate-100")} />
        <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-yellow-900/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-5 bg-yellow-500" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-5 bg-amber-600" />
        <div
          className={cn(
            "absolute inset-0",
            isDark
              ? "bg-[linear-gradient(rgba(234,179,8,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"
              : "bg-[linear-gradient(rgba(100,100,100,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,0.06)_1px,transparent_1px)] bg-[size:80px_80px]"
          )}
        />
      </div>

      <WalletModal isOpen={walletOpen} onClose={() => setWalletOpen(false)} wallet={wallet} />

      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div
          className={cn(
            "mx-4 mt-4 flex items-center justify-between px-5 py-3 rounded-2xl border backdrop-blur-xl",
            isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/90 border-slate-300"
          )}
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Scale className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <span className={cn("font-black text-lg uppercase tracking-tight leading-none block", isDark ? "text-white" : "text-slate-900")}>
                CivicLedger
              </span>
              <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-[0.4em]">Soroban · Mainnet</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-widest transition-colors",
                    isActive
                      ? "text-yellow-500"
                      : isDark
                      ? "text-slate-500 hover:text-yellow-500"
                      : "text-slate-500 hover:text-yellow-600"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} />
            {wallet.address ? (
              <button
                onClick={() => setWalletOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="font-mono">
                  {wallet.address.slice(0, 4)}…{wallet.address.slice(-4)}
                </span>
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

      {/* MAIN CONTENT */}
      <main className="pt-28">{children}</main>

      {/* FOOTER */}
      <footer className={cn("border-t px-6 py-12 mt-20", isDark ? "border-slate-800" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-yellow-500 flex items-center justify-center">
              <Scale className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <span className={cn("font-black text-base uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                CivicLedger
              </span>
              <span className={cn("text-[10px] block uppercase tracking-widest", isDark ? "text-slate-600" : "text-slate-500")}>
                Public Procurement Protocol
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-yellow-400",
                  isDark ? "text-slate-500" : "text-slate-500"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">© 2026 CivicLedger Protocol · MIT</p>
        </div>
      </footer>
    </div>
  );
}
