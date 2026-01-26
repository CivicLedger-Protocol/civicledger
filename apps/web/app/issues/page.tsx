"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  GitBranch, ExternalLink, Users, GitPullRequest,
  AlertCircle, Clock, DollarSign, ChevronRight,
} from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const GOOD_FIRST = [
  { id: "#041", title: "Add skeleton loading states to Tender Browser cards", label: "Frontend", difficulty: "Beginner", est: "2–3 hrs" },
  { id: "#038", title: "Implement responsive mobile menu for PageShell nav", label: "Frontend", difficulty: "Beginner", est: "3–4 hrs" },
  { id: "#035", title: "Write unit tests for useWallet hook (Vitest)", label: "Testing", difficulty: "Beginner", est: "2–4 hrs" },
  { id: "#031", title: "Add JSDoc comments to all Soroban contract interfaces", label: "Docs", difficulty: "Beginner", est: "3–5 hrs" },
  { id: "#027", title: "Create Korean & Spanish translations for UI strings", label: "i18n", difficulty: "Beginner", est: "4–6 hrs" },
  { id: "#022", title: "Write a contributing guide with contract test setup", label: "Docs", difficulty: "Intermediate", est: "5–8 hrs" },
];

const BOUNTIES = [
  {
    id: "#019",
    title: "Build OCDS Data Export — JSON & CSV download from Transparency Dashboard",
    label: "Feature",
    reward: "$150 USDC",
    est: "1–2 days",
    desc: "Implement a server-side export endpoint that serialises all fund movement records into OCDS-compliant JSON and flat CSV. Must pass the OCDS validator.",
  },
  {
    id: "#014",
    title: "Implement Stellar Expert deep-link for every TX hash in the Live Feed",
    label: "Frontend",
    reward: "$75 USDC",
    est: "3–5 hrs",
    desc: "Replace static TX hash strings with live links to stellar.expert/explorer/public for each transaction. Include Testnet/Mainnet toggle awareness.",
  },
  {
    id: "#009",
    title: "Build a full Playwright E2E test suite for the vendor reputation flow",
    label: "Testing",
    reward: "$200 USDC",
    est: "3–4 days",
    desc: "Cover the complete path: connect wallet, browse vendors, filter by score tier, view vendor card, and verify on-chain reputation link. Must run in CI.",
  },
  {
    id: "#005",
    title: "Migrate home page contract interaction to @stellar/stellar-sdk v12",
    label: "Backend",
    reward: "$120 USDC",
    est: "1–2 days",
    desc: "Upgrade SDK dependency and update all contract invocation code to match the v12 API. Add comprehensive TypeScript types for all contract responses.",
  },
];

const STEPS = [
  { step: "01", title: "Fork & Clone", desc: "Fork CivicLedger on GitHub and clone your fork locally. Run `pnpm install` to set up the monorepo." },
  { step: "02", title: "Pick an Issue", desc: "Find an issue labelled `good first issue` or a bounty that matches your skills. Comment to claim it." },
  { step: "03", title: "Build & Test", desc: "Create a feature branch, implement your changes, and ensure all existing tests pass. Add tests for new behaviour." },
  { step: "04", title: "Submit a PR", desc: "Open a pull request with a clear description. Link the issue, add screenshots if UI changes are involved. We review within 48 hrs." },
];

const META_STATS = [
  { label: "Total Contributors", value: "34", icon: Users },
  { label: "PRs Merged", value: "127", icon: GitPullRequest },
  { label: "Open Issues", value: "23", icon: AlertCircle },
  { label: "Avg Response Time", value: "31 hrs", icon: Clock },
];

const LABEL_COLORS: Record<string, string> = {
  Frontend: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Testing: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Docs: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  i18n: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  Feature: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Backend: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

export default function IssuesPage() {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <PageShell>
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14">
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-3">Open Source Contributions</p>
            <h1 className={cn("text-5xl md:text-6xl font-black uppercase tracking-tight mb-4", isDark ? "text-white" : "text-slate-900")}>
              Open <span className="text-yellow-400">Issues</span>
            </h1>
            <p className={cn("text-base max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
              CivicLedger is built in public. Every issue is an opportunity to shape the global standard for transparent public procurement. All levels welcome.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {META_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn("p-5 rounded-2xl border", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}
              >
                <s.icon className="w-5 h-5 mb-3 text-yellow-400" />
                <div className={cn("text-2xl font-black tracking-tight mb-1", isDark ? "text-white" : "text-slate-900")}>{s.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Good First Issues */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <h2 className={cn("text-2xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                Good First Issues
              </h2>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full", isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400")}>
                {GOOD_FIRST.length} open
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {GOOD_FIRST.map((issue, i) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl border transition-all group cursor-pointer hover:shadow-lg",
                    isDark ? "bg-slate-900 border-slate-800 hover:border-yellow-500/30" : "bg-white border-slate-200 hover:border-yellow-400"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono text-slate-500">{issue.id}</span>
                      <span className={cn("text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border", LABEL_COLORS[issue.label])}>{issue.label}</span>
                      <span className={cn("text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full", isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400")}>{issue.difficulty}</span>
                    </div>
                    <p className={cn("text-sm font-bold leading-tight mb-1", isDark ? "text-white" : "text-slate-900")}>{issue.title}</p>
                    <p className="text-[11px] text-slate-500">Est. {issue.est}</p>
                  </div>
                  <ExternalLink className={cn("w-4 h-4 shrink-0 transition-colors", isDark ? "text-slate-600 group-hover:text-yellow-400" : "text-slate-400 group-hover:text-yellow-600")} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bounty Issues */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <h2 className={cn("text-2xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                Bounty Issues
              </h2>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full text-yellow-400 bg-yellow-400/10 border border-yellow-400/20")}>
                USDC Rewards
              </span>
            </div>
            <div className="space-y-4">
              {BOUNTIES.map((issue, i) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "p-6 rounded-2xl border transition-all group cursor-pointer hover:shadow-xl",
                    isDark ? "bg-slate-900 border-slate-800 hover:border-yellow-500/30" : "bg-white border-slate-200 hover:border-yellow-400"
                  )}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono text-slate-500">{issue.id}</span>
                        <span className={cn("text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border", LABEL_COLORS[issue.label])}>{issue.label}</span>
                      </div>
                      <h3 className={cn("text-base font-black leading-tight", isDark ? "text-white" : "text-slate-900")}>{issue.title}</h3>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <DollarSign className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-sm font-black text-yellow-400">{issue.reward}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Est. {issue.est}</span>
                    </div>
                  </div>
                  <p className={cn("text-sm leading-relaxed mb-3", isDark ? "text-slate-400" : "text-slate-600")}>{issue.desc}</p>
                  <button className={cn("flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors", isDark ? "text-slate-500 group-hover:text-yellow-400" : "text-slate-400 group-hover:text-yellow-600")}>
                    Claim Bounty <ChevronRight className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How to Contribute */}
          <div className={cn("p-8 rounded-3xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
            <div className="flex items-center gap-3 mb-8">
              <GitBranch className="w-5 h-5 text-yellow-400" />
              <h2 className={cn("text-2xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>How to Contribute</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-5">
              {STEPS.map((s, i) => (
                <div key={s.step} className="flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-black text-slate-900">{s.step}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={cn("h-px flex-1 hidden md:block", isDark ? "bg-slate-700" : "bg-slate-200")} />
                    )}
                  </div>
                  <h4 className={cn("font-black uppercase text-sm tracking-wide mb-2", isDark ? "text-white" : "text-slate-900")}>{s.title}</h4>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row gap-3 border-slate-800">
              <a
                href="https://github.com/CivicLedger-Protocol/CivicLedger/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold uppercase tracking-widest text-sm bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all"
              >
                <GitBranch className="w-4 h-4" /> Browse All Issues
              </a>
              <a
                href="https://github.com/CivicLedger-Protocol/CivicLedger"
                target="_blank"
                rel="noopener noreferrer"
                className={cn("flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold uppercase tracking-widest text-sm border transition-all", isDark ? "border-slate-700 text-slate-400 hover:border-yellow-500/30 hover:text-white" : "border-slate-300 text-slate-600 hover:border-yellow-400")}
              >
                View Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
