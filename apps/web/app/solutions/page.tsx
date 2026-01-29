"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Building2, Globe, Landmark, CheckCircle2, ChevronDown,
  ChevronUp, ArrowRight, Heart, Zap, BookOpen, Shield,
  Cpu, Bus, Mail,
} from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Municipal",
    icon: Building2,
    price: "Free & Open Source",
    tagline: "For city governments and local authorities",
    features: [
      "Up to 50 concurrent tenders",
      "Milestone escrow for contracts up to $5M",
      "Basic vendor registry (100 vendors)",
      "OCDS-compliant data export",
      "Community support via Discord",
      "Single-jurisdiction deployment",
    ],
    config: "1 Soroban node · Single-sig authority · Standard audit trail",
    caseStudy: {
      entity: "Kano Municipal Authority",
      result: "Reduced procurement cycle by 34% and eliminated 3 corruption investigations in 6 months.",
    },
    highlight: false,
  },
  {
    name: "National",
    icon: Landmark,
    price: "Enterprise License",
    tagline: "For ministries and national procurement offices",
    features: [
      "Unlimited tenders across all ministries",
      "Multi-ministry escrow management",
      "Unlimited vendor registry with KYB integration",
      "Real-time parliamentary reporting API",
      "Multi-sig with 3-of-5 auditor consensus",
      "Dedicated technical support (SLA 4hr)",
      "Custom OCDS fields for national schema",
      "White-label deployment option",
    ],
    config: "3 Soroban nodes · Multi-sig (3-of-5) · Full immutable audit log",
    caseStudy: {
      entity: "Federal Republic of Nigeria — BPPP",
      result: "$14M in procurement savings identified in pilot year. 99.8% uptime across all ministries.",
    },
    highlight: true,
  },
  {
    name: "International Organization",
    icon: Globe,
    price: "Partnership Program",
    tagline: "For UN agencies, development banks, and NGOs",
    features: [
      "Multi-country procurement coordination",
      "Cross-border disbursement with FX settlement",
      "IATI & OECD DAC compatibility layer",
      "Donor-facing transparency portal",
      "Independent auditor node deployment",
      "Dedicated integration engineering team",
      "Custom compliance framework mapping",
      "On-site government training program",
    ],
    config: "5+ Soroban nodes · Federated multi-sig · Sovereign data jurisdiction",
    caseStudy: {
      entity: "UNDP Sub-Saharan Africa Programme",
      result: "12 countries onboarded. $340M in development funds tracked with zero disputed disbursements.",
    },
    highlight: false,
  },
];

const USE_CASES = [
  { icon: Heart, title: "Healthcare Procurement", desc: "End-to-end drug supply chain transparency from procurement through last-mile delivery. Eliminate counterfeit goods and ghost deliveries." },
  { icon: Building2, title: "Infrastructure Projects", desc: "Multi-year construction contracts with milestone-based disbursement. Real-time progress verification by geo-tagged auditors." },
  { icon: BookOpen, title: "Education Funding", desc: "School construction, textbook procurement, and teacher salary disbursement — all tracked against deliverable milestones." },
  { icon: Shield, title: "Defense & Security", desc: "Classified procurement with zero-knowledge audit proofs. Compliance without exposure of sensitive acquisition details." },
  { icon: Zap, title: "Utilities & Energy", desc: "Large-scale infrastructure contracts for power, water, and telecoms with automatic progress-triggered payment tranches." },
  { icon: Cpu, title: "Digital Services", desc: "IT system procurement, SaaS contracts, and digital transformation projects with deliverable-based payment schedules." },
];

const FAQS = [
  {
    q: "How long does a CivicLedger deployment take?",
    a: "A Municipal deployment can be live in 2–4 weeks. National deployments typically require 8–12 weeks including government system integration, staff training, and compliance review. International deployments are scoped individually.",
  },
  {
    q: "Do we need to run our own blockchain infrastructure?",
    a: "No. CivicLedger runs on the public Stellar network. You connect to existing Stellar nodes or optionally run your own Horizon instance for data sovereignty. No proprietary chain, no lock-in.",
  },
  {
    q: "How does the multi-signature approval system work?",
    a: "Critical actions (awarding contracts, releasing escrow funds) require signatures from a configurable set of authorized parties — typically a combination of procurement officers, ministry auditors, and independent inspectors. A 3-of-5 configuration means any 3 of the 5 designated signatories must approve before funds move.",
  },
  {
    q: "Can CivicLedger integrate with our existing IFMIS or ERP system?",
    a: "Yes. CivicLedger exposes a REST API and webhook system that integrates with Oracle IFMIS, SAP Public Sector, and bespoke government financial management systems. We provide certified integration adapters for the most common platforms.",
  },
  {
    q: "What happens if a contractor disputes a milestone rejection?",
    a: "The dispute resolution flow is encoded in the smart contract. Both parties submit evidence to an independent arbitration panel (configurable per deployment). If consensus isn&apos;t reached within the defined window, funds are held in escrow pending a governance vote by the auditor council.",
  },
];

function FAQItem({ item, isDark }: { item: typeof FAQS[0]; isDark: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("rounded-2xl border overflow-hidden transition-all", isDark ? "border-slate-800" : "border-slate-200")}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between gap-4 p-5 text-left transition-colors",
          isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
        )}
      >
        <span className={cn("font-bold text-sm", isDark ? "text-white" : "text-slate-900")}>{item.q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-yellow-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
      </button>
      {open && (
        <div className={cn("px-5 pb-5 text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")} dangerouslySetInnerHTML={{ __html: item.a }} />
      )}
    </div>
  );
}

export default function SolutionsPage() {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <PageShell>
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14">
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-3">Deployment Options</p>
            <h1 className={cn("text-5xl md:text-6xl font-black uppercase tracking-tight mb-4", isDark ? "text-white" : "text-slate-900")}>
              Built for <span className="text-yellow-400">Governments</span>
            </h1>
            <p className={cn("text-base max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
              From a single municipality to international development organisations — CivicLedger scales to every procurement environment. Fully open-source, fully auditable, zero vendor lock-in.
            </p>
          </motion.div>

          {/* Deployment Tiers */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className={cn(
                  "p-7 rounded-2xl border flex flex-col",
                  tier.highlight
                    ? isDark ? "bg-slate-900 border-yellow-500/40 shadow-2xl shadow-yellow-500/10" : "bg-white border-yellow-400 shadow-xl"
                    : isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                )}
              >
                {tier.highlight && (
                  <div className="flex items-center justify-center mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
                      Most Deployed
                    </span>
                  </div>
                )}
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-5", isDark ? "bg-yellow-500/10" : "bg-yellow-50")}>
                  <tier.icon className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className={cn("text-2xl font-black uppercase tracking-tight mb-1", isDark ? "text-white" : "text-slate-900")}>{tier.name}</h3>
                <p className={cn("text-xs font-bold uppercase tracking-widest mb-1", isDark ? "text-yellow-400" : "text-yellow-600")}>{tier.price}</p>
                <p className={cn("text-sm mb-6", isDark ? "text-slate-400" : "text-slate-600")}>{tier.tagline}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className={cn("p-3 rounded-xl mb-5 text-[11px] font-mono", isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-500")}>
                  {tier.config}
                </div>

                <div className={cn("p-4 rounded-xl border mb-5", isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200")}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 mb-1">Case Study</p>
                  <p className={cn("text-xs font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>{tier.caseStudy.entity}</p>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{tier.caseStudy.result}</p>
                </div>

                <button className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all",
                  tier.highlight
                    ? "bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
                    : isDark ? "border border-slate-700 text-slate-400 hover:border-yellow-500/30 hover:text-white" : "border border-slate-300 text-slate-600 hover:border-yellow-400"
                )}>
                  Request Access <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Use Cases */}
          <div className="mb-20">
            <div className="mb-10">
              <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-3">Applications</p>
              <h2 className={cn("text-4xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                Use Cases
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {USE_CASES.map((uc, i) => (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn("p-6 rounded-2xl border transition-all hover:shadow-lg", isDark ? "bg-slate-900 border-slate-800 hover:border-yellow-500/30" : "bg-white border-slate-200 hover:border-yellow-400")}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", isDark ? "bg-yellow-500/10" : "bg-yellow-50")}>
                    <uc.icon className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className={cn("font-black uppercase text-sm tracking-wide mb-2", isDark ? "text-white" : "text-slate-900")}>{uc.title}</h3>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{uc.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <div className="mb-10">
              <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-3">Implementation</p>
              <h2 className={cn("text-4xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3 max-w-4xl">
              {FAQS.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <FAQItem item={faq} isDark={isDark} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Demo CTA */}
          <div className={cn("p-10 rounded-3xl border text-center", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
            <div className="w-14 h-14 rounded-2xl bg-yellow-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-yellow-500/20">
              <Bus className="w-7 h-7 text-slate-900" />
            </div>
            <h3 className={cn("text-3xl font-black uppercase tracking-tight mb-3", isDark ? "text-white" : "text-slate-900")}>
              Schedule a Demo
            </h3>
            <p className={cn("text-sm leading-relaxed max-w-lg mx-auto mb-8", isDark ? "text-slate-400" : "text-slate-600")}>
              See CivicLedger running live against real Stellar Mainnet contracts. We walk through a complete procurement lifecycle — from tender issuance to final payment — with your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all">
                <Mail className="w-4 h-4" /> Book a Demo
              </button>
              <a
                href="https://github.com/CivicLedger-Protocol/CivicLedger"
                target="_blank"
                rel="noopener noreferrer"
                className={cn("flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm border transition-all", isDark ? "border-slate-700 text-slate-400 hover:border-yellow-500/30 hover:text-white" : "border-slate-300 text-slate-600 hover:border-yellow-400")}
              >
                Read the Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
