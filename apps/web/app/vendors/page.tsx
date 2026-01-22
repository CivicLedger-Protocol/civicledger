"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Search, Filter, Star, CheckCircle2, Award,
  TrendingUp, Clock, ShieldCheck, Info,
} from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const VENDORS = [
  {
    id: "VND-0081",
    name: "Meridian Construction Ltd",
    sector: "Infrastructure",
    score: 96,
    contracts: 34,
    totalValue: "$142.3M",
    onTimeRate: "97%",
    verified: true,
  },
  {
    id: "VND-0074",
    name: "TechBridge Solutions",
    sector: "Technology",
    score: 91,
    contracts: 22,
    totalValue: "$38.7M",
    onTimeRate: "95%",
    verified: true,
  },
  {
    id: "VND-0069",
    name: "AquaFlow Engineering",
    sector: "Utilities",
    score: 88,
    contracts: 18,
    totalValue: "$61.2M",
    onTimeRate: "92%",
    verified: true,
  },
  {
    id: "VND-0063",
    name: "EduBuild Africa",
    sector: "Education",
    score: 84,
    contracts: 27,
    totalValue: "$55.8M",
    onTimeRate: "89%",
    verified: true,
  },
  {
    id: "VND-0058",
    name: "DataPort Systems",
    sector: "Technology",
    score: 79,
    contracts: 14,
    totalValue: "$22.1M",
    onTimeRate: "86%",
    verified: true,
  },
  {
    id: "VND-0051",
    name: "GreenGrid Energy",
    sector: "Energy",
    score: 93,
    contracts: 11,
    totalValue: "$47.5M",
    onTimeRate: "100%",
    verified: true,
  },
  {
    id: "VND-0044",
    name: "HealthChain Logistics",
    sector: "Healthcare",
    score: 87,
    contracts: 19,
    totalValue: "$29.4M",
    onTimeRate: "91%",
    verified: false,
  },
  {
    id: "VND-0038",
    name: "TransCivic Infrastructure",
    sector: "Transport",
    score: 75,
    contracts: 9,
    totalValue: "$18.9M",
    onTimeRate: "84%",
    verified: false,
  },
  {
    id: "VND-0032",
    name: "Horizon Civil Works",
    sector: "Infrastructure",
    score: 82,
    contracts: 16,
    totalValue: "$73.1M",
    onTimeRate: "88%",
    verified: true,
  },
  {
    id: "VND-0027",
    name: "NovaMed Supplies",
    sector: "Healthcare",
    score: 71,
    contracts: 8,
    totalValue: "$11.2M",
    onTimeRate: "81%",
    verified: false,
  },
];

const SECTORS = ["All", "Infrastructure", "Technology", "Utilities", "Education", "Energy", "Healthcare", "Transport"];

function ScoreBar({ score, isDark }: { score: number; isDark: boolean }) {
  const color = score >= 90 ? "bg-emerald-400" : score >= 75 ? "bg-yellow-400" : "bg-orange-400";
  return (
    <div className={cn("w-full h-1.5 rounded-full overflow-hidden", isDark ? "bg-slate-700" : "bg-slate-200")}>
      <div
        className={cn("h-full rounded-full transition-all", color)}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function StarRating({ score }: { score: number }) {
  const stars = Math.round(score / 20);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn("w-3 h-3", s <= stars ? "text-yellow-400 fill-yellow-400" : "text-slate-600")}
        />
      ))}
    </div>
  );
}

export default function VendorsPage() {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [minScore, setMinScore] = useState(0);

  const filtered = VENDORS.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase());
    const matchSector = sector === "All" || v.sector === sector;
    const matchScore = v.score >= minScore;
    return matchSearch && matchSector && matchScore;
  }).sort((a, b) => b.score - a.score);

  return (
    <PageShell>
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-3">
              Contractor Credentialing System
            </p>
            <h1
              className={cn(
                "text-5xl md:text-6xl font-black uppercase tracking-tight mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Vendor <span className="text-yellow-400">Registry</span>
            </h1>
            <p className={cn("text-base max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
              All registered contractors on the CivicLedger protocol, ranked by their on-chain reputation
              score — an objective, tamper-proof measure of delivery performance.
            </p>
          </motion.div>

          {/* Reputation Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={cn(
              "flex items-start gap-4 p-5 rounded-2xl border mb-8",
              isDark ? "bg-yellow-500/5 border-yellow-500/15" : "bg-yellow-50 border-yellow-200"
            )}
          >
            <Info className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className={cn("text-sm font-bold mb-1", isDark ? "text-yellow-300" : "text-yellow-800")}>
                How Reputation Scores Work
              </p>
              <p className={cn("text-xs leading-relaxed", isDark ? "text-yellow-200/60" : "text-yellow-700")}>
                Each vendor&apos;s score (0–100) is computed entirely on-chain from historical contract data: milestone
                delivery rate, on-time completion, dispute history, and audit outcomes. Scores are non-transferable
                soulbound credentials — they cannot be purchased, delegated, or manipulated. Score ≥90 = Elite,
                75–89 = Trusted, 60–74 = Standard, &lt;60 = Under Review.
              </p>
            </div>
          </motion.div>

          {/* Filters */}
          <div
            className={cn(
              "flex flex-col md:flex-row gap-3 mb-8 p-4 rounded-2xl border",
              isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
            )}
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search vendors by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border transition-all outline-none",
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-yellow-500/50"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-yellow-400"
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-sm border outline-none cursor-pointer",
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                )}
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>{s === "All" ? "All Sectors" : s}</option>
                ))}
              </select>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-sm border outline-none cursor-pointer",
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                )}
              >
                <option value={0}>All Scores</option>
                <option value={90}>Elite (90+)</option>
                <option value={75}>Trusted (75+)</option>
                <option value={60}>Standard (60+)</option>
              </select>
            </div>
          </div>

          <div className="mb-5">
            <p className={cn("text-xs font-bold uppercase tracking-widest", isDark ? "text-slate-500" : "text-slate-400")}>
              {filtered.length} vendors found · sorted by reputation score
            </p>
          </div>

          {/* Vendor Cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((vendor, i) => {
              const scoreColor =
                vendor.score >= 90
                  ? "text-emerald-400"
                  : vendor.score >= 75
                  ? "text-yellow-400"
                  : "text-orange-400";

              return (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "p-6 rounded-2xl border transition-all group cursor-pointer hover:shadow-xl",
                    isDark
                      ? "bg-slate-900 border-slate-800 hover:border-yellow-500/30"
                      : "bg-white border-slate-200 hover:border-yellow-400"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[10px] font-mono text-slate-500 tracking-widest">{vendor.id}</p>
                        {vendor.verified && (
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                          </span>
                        )}
                      </div>
                      <h3
                        className={cn(
                          "font-black text-lg leading-tight tracking-tight",
                          isDark ? "text-white" : "text-slate-900"
                        )}
                      >
                        {vendor.name}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn("text-3xl font-black", scoreColor)}>{vendor.score}</div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest">/ 100</div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mb-4">
                    <ScoreBar score={vendor.score} isDark={isDark} />
                    <div className="flex items-center justify-between mt-1.5">
                      <StarRating score={vendor.score} />
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{vendor.sector}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className={cn("p-3 rounded-xl text-center", isDark ? "bg-slate-800" : "bg-slate-50")}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Award className="w-3 h-3 text-yellow-500" />
                      </div>
                      <p className={cn("text-base font-black", isDark ? "text-white" : "text-slate-900")}>
                        {vendor.contracts}
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">Contracts</p>
                    </div>
                    <div className={cn("p-3 rounded-xl text-center", isDark ? "bg-slate-800" : "bg-slate-50")}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-yellow-500" />
                      </div>
                      <p className={cn("text-sm font-black", isDark ? "text-white" : "text-slate-900")}>
                        {vendor.totalValue}
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">Delivered</p>
                    </div>
                    <div className={cn("p-3 rounded-xl text-center", isDark ? "bg-slate-800" : "bg-slate-50")}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-yellow-500" />
                      </div>
                      <p className={cn("text-base font-black", isDark ? "text-white" : "text-slate-900")}>
                        {vendor.onTimeRate}
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">On-Time</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Scoring Legend */}
          <div
            className={cn(
              "mt-12 p-6 rounded-2xl border",
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}
          >
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck className="w-5 h-5 text-yellow-500" />
              <h3 className={cn("font-black uppercase text-sm tracking-wide", isDark ? "text-white" : "text-slate-900")}>
                Reputation Score Tiers
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Elite", range: "90–100", color: "text-emerald-400", bg: isDark ? "bg-emerald-400/10" : "bg-emerald-50", border: "border-emerald-400/20" },
                { label: "Trusted", range: "75–89", color: "text-yellow-400", bg: isDark ? "bg-yellow-400/10" : "bg-yellow-50", border: "border-yellow-400/20" },
                { label: "Standard", range: "60–74", color: "text-orange-400", bg: isDark ? "bg-orange-400/10" : "bg-orange-50", border: "border-orange-400/20" },
                { label: "Under Review", range: "< 60", color: "text-red-400", bg: isDark ? "bg-red-400/10" : "bg-red-50", border: "border-red-400/20" },
              ].map((tier) => (
                <div key={tier.label} className={cn("p-4 rounded-xl border", tier.bg, tier.border)}>
                  <p className={cn("text-base font-black mb-0.5", tier.color)}>{tier.label}</p>
                  <p className="text-[11px] text-slate-500 font-bold">{tier.range}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
