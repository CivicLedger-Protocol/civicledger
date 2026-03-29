"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  FileText, Filter, Search, Clock, CheckCircle2,
  TrendingUp, Users, BarChart3, ChevronRight, Calendar,
  Building2, Banknote,
} from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const TENDERS = [
  {
    id: "TDR-2026-0041",
    title: "National Highway Rehabilitation — Phase IV",
    authority: "Ministry of Infrastructure & Transport",
    sector: "Infrastructure",
    value: "$24,500,000",
    deadline: "2026-06-15",
    status: "Open",
    bids: 7,
  },
  {
    id: "TDR-2026-0039",
    title: "Municipal Water Treatment Plant Upgrade",
    authority: "Lagos State Water Corporation",
    sector: "Utilities",
    value: "$8,750,000",
    deadline: "2026-06-08",
    status: "Bidding",
    bids: 12,
  },
  {
    id: "TDR-2026-0037",
    title: "Digital Identity System Procurement",
    authority: "National Information Technology Agency",
    sector: "Technology",
    value: "$5,200,000",
    deadline: "2026-05-28",
    status: "Bidding",
    bids: 9,
  },
  {
    id: "TDR-2026-0033",
    title: "Healthcare Supply Chain Modernization",
    authority: "Federal Ministry of Health",
    sector: "Healthcare",
    value: "$11,300,000",
    deadline: "2026-07-01",
    status: "Open",
    bids: 4,
  },
  {
    id: "TDR-2026-0029",
    title: "School Building Construction — 120 Units",
    authority: "Universal Basic Education Commission",
    sector: "Education",
    value: "$18,900,000",
    deadline: "2026-04-30",
    status: "Awarded",
    bids: 15,
  },
  {
    id: "TDR-2026-0025",
    title: "Port Logistics Management System",
    authority: "Nigerian Ports Authority",
    sector: "Technology",
    value: "$3,600,000",
    deadline: "2026-03-20",
    status: "Completed",
    bids: 6,
  },
  {
    id: "TDR-2026-0022",
    title: "Renewable Energy Grid Extension",
    authority: "Rural Electrification Agency",
    sector: "Energy",
    value: "$14,100,000",
    deadline: "2026-07-20",
    status: "Open",
    bids: 3,
  },
  {
    id: "TDR-2026-0018",
    title: "Urban Transport Fleet Renewal",
    authority: "Lagos Metropolitan Area Transport Authority",
    sector: "Transport",
    value: "$9,800,000",
    deadline: "2026-05-10",
    status: "Awarded",
    bids: 11,
  },
];

const STATUS_COLORS: Record<string, string> = {
  Open: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Bidding: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Awarded: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Completed: "text-slate-400 bg-slate-400/10 border-slate-400/20",
};

const STATS = [
  { label: "Active Tenders", value: "142", icon: FileText, color: "text-yellow-400" },
  { label: "Total Value on Platform", value: "$91.2M", icon: TrendingUp, color: "text-amber-400" },
  { label: "Avg Bids Per Tender", value: "8.4", icon: Users, color: "text-yellow-300" },
  { label: "Avg Award Time", value: "19 Days", icon: Clock, color: "text-amber-300" },
];

const SECTORS = ["All", "Infrastructure", "Utilities", "Technology", "Healthcare", "Education", "Energy", "Transport"];
const STATUSES = ["All", "Open", "Bidding", "Awarded", "Completed"];

export default function TendersPage() {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = TENDERS.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.authority.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchSector = sector === "All" || t.sector === sector;
    const matchStatus = status === "All" || t.status === status;
    return matchSearch && matchSector && matchStatus;
  });

  return (
    <PageShell>
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.5em] mb-3">
              Public Procurement Registry
            </p>
            <h1
              className={cn(
                "text-5xl md:text-6xl font-black uppercase tracking-tight mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Tender <span className="text-yellow-400">Browser</span>
            </h1>
            <p className={cn("text-base max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
              All government procurement opportunities registered on the CivicLedger protocol. Every tender
              is cryptographically verified and OCDS-compliant.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "p-5 rounded-2xl border",
                  isDark
                    ? "bg-slate-900/60 border-slate-800"
                    : "bg-white border-slate-200"
                )}
              >
                <s.icon className={cn("w-5 h-5 mb-3", s.color)} />
                <div className={cn("text-2xl font-black tracking-tight mb-1", isDark ? "text-white" : "text-slate-900")}>
                  {s.value}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>

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
                placeholder="Search tenders, authorities, IDs..."
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-sm border outline-none cursor-pointer",
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                )}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-5">
            <p className={cn("text-xs font-bold uppercase tracking-widest", isDark ? "text-slate-500" : "text-slate-400")}>
              Showing {filtered.length} of {TENDERS.length} tenders
            </p>
          </div>

          {/* Tender Cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((tender, i) => (
              <motion.div
                key={tender.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "p-6 rounded-2xl border transition-all group cursor-pointer hover:shadow-xl",
                  isDark
                    ? "bg-slate-900 border-slate-800 hover:border-yellow-500/30"
                    : "bg-white border-slate-200 hover:border-yellow-400"
                )}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 tracking-widest mb-1">{tender.id}</p>
                    <h3
                      className={cn(
                        "font-black text-base leading-tight tracking-tight",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {tender.title}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0",
                      STATUS_COLORS[tender.status]
                    )}
                  >
                    {tender.status}
                  </span>
                </div>

                {/* Authority */}
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-600")}>
                    {tender.authority}
                  </p>
                </div>

                {/* Data grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className={cn("p-3 rounded-xl", isDark ? "bg-slate-800" : "bg-slate-50")}>
                    <div className="flex items-center gap-1 mb-1">
                      <Banknote className="w-3 h-3 text-yellow-500" />
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider">Value</span>
                    </div>
                    <p className={cn("text-sm font-black", isDark ? "text-white" : "text-slate-900")}>
                      {tender.value}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-xl", isDark ? "bg-slate-800" : "bg-slate-50")}>
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-yellow-500" />
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider">Deadline</span>
                    </div>
                    <p className={cn("text-xs font-bold", isDark ? "text-white" : "text-slate-900")}>
                      {tender.deadline}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-xl", isDark ? "bg-slate-800" : "bg-slate-50")}>
                    <div className="flex items-center gap-1 mb-1">
                      <BarChart3 className="w-3 h-3 text-yellow-500" />
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider">Bids</span>
                    </div>
                    <p className={cn("text-sm font-black", isDark ? "text-white" : "text-slate-900")}>
                      {tender.bids}
                    </p>
                  </div>
                </div>

                {/* Sector + CTA */}
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg",
                      isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {tender.sector}
                  </span>
                  <button
                    className={cn(
                      "flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors",
                      isDark
                        ? "text-slate-500 group-hover:text-yellow-400"
                        : "text-slate-400 group-hover:text-yellow-600"
                    )}
                  >
                    View Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={cn("text-center py-20 rounded-2xl border", isDark ? "border-slate-800" : "border-slate-200")}>
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className={cn("font-bold text-lg mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                No tenders match your filters
              </p>
              <p className="text-sm text-slate-500">Try adjusting your search criteria.</p>
            </div>
          )}

          {/* OCDS badge */}
          <div className="mt-10 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              All tenders comply with the Open Contracting Data Standard (OCDS) v1.1.5
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
