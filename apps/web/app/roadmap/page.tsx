"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Rocket, Globe, Building2 } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const PHASES = [
  {
    phase: "Phase 1",
    label: "Foundation",
    period: "Q2 2026",
    status: "completed",
    color: "text-emerald-400",
    borderColor: "border-emerald-400",
    bgColor: "bg-emerald-400",
    adoption: "3 pilot municipalities",
    milestones: [
      { label: "Tender Registry smart contract — Mainnet deployment", done: true },
      { label: "Milestone Escrow v1 — single-sig authority", done: true },
      { label: "Vendor Reputation soulbound credential system", done: true },
      { label: "Freighter wallet integration & public UI", done: true },
      { label: "OCDS v1.1.5 data export compliance", done: true },
    ],
  },
  {
    phase: "Phase 2",
    label: "Scale",
    period: "Q3–Q4 2026",
    status: "active",
    color: "text-yellow-400",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-500",
    adoption: "2 national deployments",
    milestones: [
      { label: "Multi-sig escrow (3-of-5 auditor consensus)", done: true },
      { label: "REST API & webhook integration layer", done: true },
      { label: "Parliamentary reporting dashboard", done: false },
      { label: "IFMIS adapter for Oracle & SAP", done: false },
      { label: "Mobile audit verification app (iOS + Android)", done: false },
    ],
  },
  {
    phase: "Phase 3",
    label: "Interoperability",
    period: "Q1–Q2 2027",
    status: "planned",
    color: "text-slate-400",
    borderColor: "border-slate-600",
    bgColor: "bg-slate-500",
    adoption: "8 countries, 1 development bank",
    milestones: [
      { label: "Cross-border procurement coordination layer", done: false },
      { label: "IATI & OECD DAC compatibility mapping", done: false },
      { label: "Zero-knowledge proof milestone verification", done: false },
      { label: "Federated multi-jurisdiction governance module", done: false },
      { label: "Donor-facing transparency portal (white-label)", done: false },
    ],
  },
  {
    phase: "Phase 4",
    label: "Global Standard",
    period: "Q3–Q4 2027",
    status: "future",
    color: "text-slate-500",
    borderColor: "border-slate-700",
    bgColor: "bg-slate-600",
    adoption: "25+ countries, UN agency integration",
    milestones: [
      { label: "UN Sustainable Development Goals procurement tagging", done: false },
      { label: "AI-powered anomaly detection & fraud signals", done: false },
      { label: "Cross-chain bridge for CBDC settlement", done: false },
      { label: "Decentralized arbitration protocol for disputes", done: false },
      { label: "Open standard publication — ISO submission", done: false },
    ],
  },
];

const ADOPTION_STATS = [
  { label: "Countries Targeted by 2027", value: "25+", icon: Globe },
  { label: "Pilot Municipalities", value: "3", icon: Building2 },
  { label: "National Deployments (Pipeline)", value: "7", icon: Rocket },
  { label: "Est. Procurement Value Tracked", value: "$2.4B", icon: Clock },
];

export default function RoadmapPage() {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <PageShell>
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14">
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-3">Development Timeline</p>
            <h1 className={cn("text-5xl md:text-6xl font-black uppercase tracking-tight mb-4", isDark ? "text-white" : "text-slate-900")}>
              Protocol <span className="text-yellow-400">Roadmap</span>
            </h1>
            <p className={cn("text-base max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
              A four-phase development plan from initial Mainnet deployment to becoming the global standard for public procurement transparency.
            </p>
          </motion.div>

          {/* Adoption stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {ADOPTION_STATS.map((s, i) => (
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

          {/* Timeline */}
          <div className="relative">
            {/* Vertical spine */}
            <div className={cn("absolute left-[1.35rem] top-0 bottom-0 w-px", isDark ? "bg-slate-800" : "bg-slate-200")} />

            <div className="space-y-10">
              {PHASES.map((phase, i) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative pl-14"
                >
                  {/* Dot */}
                  <div className={cn("absolute left-0 top-5 w-11 h-11 rounded-full border-2 flex items-center justify-center", phase.borderColor, isDark ? "bg-slate-950" : "bg-slate-100")}>
                    <span className={cn("text-[11px] font-black", phase.color)}>{i + 1}</span>
                  </div>

                  <div className={cn("p-7 rounded-2xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                    {/* Phase header */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border",
                            phase.status === "completed" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
                            phase.status === "active" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                            isDark ? "text-slate-500 bg-slate-800 border-slate-700" : "text-slate-400 bg-slate-100 border-slate-200"
                          )}>
                            {phase.status === "completed" ? "Completed" : phase.status === "active" ? "In Progress" : "Planned"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{phase.period}</span>
                        </div>
                        <h3 className={cn("text-2xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                          {phase.phase}: {phase.label}
                        </h3>
                      </div>
                      <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border shrink-0",
                        isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                      )}>
                        <Globe className="w-4 h-4 text-yellow-400" />
                        <span className={cn("text-xs font-bold", isDark ? "text-slate-300" : "text-slate-700")}>{phase.adoption}</span>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="space-y-3">
                      {phase.milestones.map((m, j) => (
                        <div key={j} className="flex items-center gap-3">
                          {m.done ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className={cn("w-5 h-5 shrink-0", phase.status === "active" ? "text-yellow-500/40" : "text-slate-600")} />
                          )}
                          <span className={cn("text-sm", m.done ? isDark ? "text-slate-300" : "text-slate-700" : isDark ? "text-slate-500" : "text-slate-400")}>
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("mt-16 p-8 rounded-2xl border text-center", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}
          >
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-3">Contribute</p>
            <h3 className={cn("text-3xl font-black uppercase tracking-tight mb-3", isDark ? "text-white" : "text-slate-900")}>
              Help Build the Future of Public Finance
            </h3>
            <p className={cn("text-sm max-w-lg mx-auto mb-6 leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
              CivicLedger is open-source infrastructure. Every line of code, every audit standard, and every governance decision is public. Join the contributors building transparent government finance.
            </p>
            <a
              href="https://github.com/CivicLedger-Protocol/CivicLedger"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all"
            >
              View on GitHub
            </a>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
