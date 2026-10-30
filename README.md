# CivicLedger

```
╔═══════════════════════════════════════════════════════════════════╗
║  PUBLIC PROCUREMENT — IMMUTABLY ON-CHAIN                         ║
║  Every tender. Every bid. Every naira. Cryptographically sealed. ║
╚═══════════════════════════════════════════════════════════════════╝
```

[![Protocol](https://img.shields.io/badge/Status-Seeking%20Builders-eab308?style=flat-square)](https://github.com/CivicLedger-Protocol/civicledger)
[![License](https://img.shields.io/badge/License-MIT-white?style=flat-square)](LICENSE)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar%20Soroban-0ea5e9?style=flat-square&logo=stellar)](https://stellar.org)
[![Live App](https://img.shields.io/badge/Frontend-civicledger.vercel.app-eab308?style=flat-square)](https://civicledger.vercel.app)

---

## The Idea

Governments collectively spend $13 trillion on public contracts every year. Approximately $2 trillion of that — roughly 15% — disappears to corruption, fraud, and opacity. The mechanism is always the same: contracts are awarded in closed rooms, funds are disbursed against unverified milestones, vendor performance is never recorded, and the entire system resets next fiscal year with no memory of what happened before.

**CivicLedger doesn't patch this system. It replaces it.**

The protocol makes corruption structurally impossible — not by adding oversight layers on top of the existing machinery, but by putting the machinery itself on a public blockchain. When every tender is published on-chain, when every bid is sealed and revealed by smart contract, when every fund disbursement requires cryptographic proof of milestone completion, there are no dark rooms left to operate in.

We have the architecture, the frontend, and the conviction. **We need builders to make it real.**

---

## What Exists Today!

The repository contains:

```
civicledger/
├── apps/
│   └── web/          ← Next.js 14 frontend (fully designed, live at civicledger.vercel.app)
├── contracts/
│   ├── tender-registry/      ← Scaffold — needs implementation
│   ├── milestone-escrow/     ← Scaffold — needs implementation
│   └── vendor-reputation/    ← Scaffold — needs implementation
└── docs/             ← Architecture specifications
```

The frontend is production-grade and deployed. The smart contracts are scaffolded with the correct structure but the core logic — the part that actually makes procurement corruption impossible — still needs to be written. That's what we're here to build.

---

## What We Need Built

### Priority 1 · Tender Registry Contract `contracts/tender-registry`

The authoritative on-chain source for all public tenders. An OCDS-compliant (Open Contracting Data Standard) registry that manages the full procurement lifecycle state machine.

**Functions needed:**
- `publish_tender(admin, title, budget, scope, deadline)` → assigns tender ID
- `submit_bid(vendor, tender_id, encrypted_bid_hash)` → seals bid until reveal
- `reveal_bids(admin, tender_id)` → opens all bids simultaneously at deadline
- `award_contract(admin, tender_id, winning_vendor)` → triggers escrow creation
- `get_tender(id)` → public read of full tender state
- `get_active_tenders()` → list all open tenders

**State machine:** `Draft → Open → Bidding → Evaluation → Awarded → Active → Completed`

---

### Priority 2 · Milestone Escrow Contract `contracts/milestone-escrow`

The disbursement engine. Holds contract funds and releases tranches only when deliverables are cryptographically verified by both government auditors and independent inspectors.

**Functions needed:**
- `create_escrow(tender_id, vendor, total_xlm, milestone_schedule)` → locks funds
- `submit_milestone(vendor, escrow_id, milestone_idx, proof_hash)` → vendor attests completion
- `approve_milestone(auditor, escrow_id, milestone_idx)` → requires M-of-N signatures
- `release_tranche(escrow_id, milestone_idx)` → disburses XLM after approvals
- `raise_dispute(party, escrow_id, milestone_idx, evidence_hash)` → freezes escrow
- `get_escrow_state(id)` → full escrow status and milestone progress

---

### Priority 3 · Vendor Reputation Contract `contracts/vendor-reputation`

A non-transferable, soulbound reputation system. On-time completions earn credits. Delays and disputes incur automatic penalties. The record is permanent and cannot be deleted.

**Functions needed:**
- `register_vendor(address, legal_name, registration_hash)` → on-chain KYB anchor
- `record_completion(tender_id, vendor, on_time: bool, quality_score: u32)` → post-contract
- `record_penalty(tender_id, vendor, penalty_type)` → automatic on breach
- `get_vendor_score(address)` → composite reputation score
- `get_vendor_history(address)` → full immutable record

---

## Technical Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Rust + Soroban SDK 22.x |
| Target | wasm32v1-none (Stellar Protocol 22) |
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Wallet | Freighter (Stellar browser extension) |
| Package Manager | pnpm |
| Network | Stellar Soroban Testnet → Mainnet |

---

## Development Setup

```bash
# Prerequisites: Rust 1.78+, Stellar CLI 25+, Node.js 20+, pnpm 9+

git clone https://github.com/CivicLedger-Protocol/civicledger
cd civicledger

# Build contracts
stellar contract build --package tender-registry
stellar contract build --package milestone-escrow
stellar contract build --package vendor-reputation

# Run frontend
cd apps/web
pnpm install
pnpm dev
```

---

## Roadmap

### Phase 0 — Foundation `DONE`
- [x] Protocol architecture designed and documented
- [x] Contract scaffolds created (tender-registry, milestone-escrow, vendor-reputation)
- [x] Frontend deployed and live at civicledger.vercel.app
- [x] Two-tier institutional header with live block height
- [x] OCDS compliance framework specified
- [x] MIT license, contribution guidelines, security policy

---

### Phase 1 — Core Contracts `IN PROGRESS · Q2 2026`
- [ ] Tender Registry: full lifecycle state machine (Open → Bidding → Awarded → Completed)
- [ ] Sealed-bid mechanism: encrypted bid submission + simultaneous reveal at deadline
- [ ] Milestone Escrow: fund locking + M-of-N approval + tranche release
- [ ] Vendor Reputation: soulbound scoring + on-chain penalty recording
- [ ] Unit tests for all three contracts (target: 100% function coverage)
- [ ] Integration test: full procurement lifecycle on Soroban testnet
- [ ] Testnet deployment + contract addresses published in README
- [ ] Stellar Expert contract verification

---

### Phase 2 — Government Integration Layer `Q3 2026`
- [ ] OCDS data adapter: exports contract data in Open Contracting Data Standard JSON
- [ ] ERP connector: SAP Ariba and Oracle Procurement Cloud webhook integration
- [ ] Freighter wallet flows: vendor registration, bid submission, milestone reporting
- [ ] Government dashboard: real-time tender board with live chain data
- [ ] Vendor portal: bid submission interface, escrow status tracker
- [ ] Auditor interface: milestone approval flows with multi-sig
- [ ] Mobile-optimized views for field auditors
- [ ] REST + GraphQL API for third-party transparency tools

---

### Phase 3 — Dispute Resolution & Governance `Q4 2026`
- [ ] On-chain dispute protocol: evidence submission, arbitration panel, binding resolution
- [ ] Reputation appeals process: vendor challenge mechanism with evidence hash
- [ ] DAO governance: community voting on protocol parameter changes
- [ ] Timelocked admin functions: all sensitive operations subject to 72-hour delay
- [ ] Multi-jurisdictional templates: configurable procurement rules for different legal frameworks
- [ ] International interoperability: alignment with World Bank procurement standards
- [ ] Public API for civil society and journalism organizations

---

### Phase 4 — Mainnet & Partnerships `Q1 2027`
- [ ] Independent security audit (Soroban contract specialist firm)
- [ ] Bug bounty program on Immunefi
- [ ] Mainnet deployment with formal partner government announcement
- [ ] Pilot: 3 municipal governments — target jurisdictions include Lagos State, Nairobi County, and one EU member municipality
- [ ] Integration with existing transparency NGOs (Global Integrity, Open Contracting Partnership)
- [ ] Media partnerships for launch coverage
- [ ] Protocol treasury establishment for ongoing maintenance

---

### Phase 5 — Scale `2027 and Beyond`
- [ ] National-level government pilots (World Bank / IDA program alignment)
- [ ] AI-assisted anomaly detection: flag suspicious bid patterns in real time
- [ ] Cross-border procurement framework for regional economic communities
- [ ] Academic partnership for procurement data research
- [ ] Sovereign deployment kit: self-hosted version for air-gapped government environments
- [ ] UN Global Compact alignment for ESG-scored procurement data

---

## Why Stellar Soroban

Public procurement requires sub-cent transaction costs to be viable at scale. A government running 5,000 tenders per year cannot pay $50 in Ethereum gas fees per state transition. Stellar's near-zero fees and sub-second finality make every bid submission, every milestone approval, and every fund disbursement economically viable — regardless of transaction size.

USDC native support enables procurement payments in a stable currency without bridge risk. Freighter's growing adoption in Africa and Southeast Asia (the regions with the highest procurement corruption rates) means our target users already have the wallet infrastructure.

---

## The Contributors We're Looking For

**Rust / Soroban developers** — to implement the three core contracts. Prior Soroban experience helpful but not required; strong Rust fundamentals are more important.

**TypeScript / Next.js developers** — to wire the frontend to live contract state. The UI exists and is polished; it needs to read real on-chain data.

**Open data / OCDS specialists** — to help design the OCDS compliance layer and government system integrations.

**Security researchers** — to review contract logic, especially the sealed-bid mechanism and multi-sig escrow.

All issues are labeled `good first issue`, `contract`, `frontend`, `backend`, `documentation`, or `research`. Check the Issues tab.

---

## Contributing

Read `CONTRIBUTING.md` for setup instructions and PR standards.

Every merged contribution is recorded on-chain by the contributor's GitHub identity. This is intentional: the people building accountability infrastructure should be accountable themselves.

---

*CivicLedger is not affiliated with any government. It is open-source infrastructure available for any government, NGO, or transparency organization to use, fork, or deploy.*

*© 2026 CivicLedger Protocol contributors · MIT License*
