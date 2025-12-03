# CivicLedger — Public Procurement Protocol

> Immutable accountability for every dollar of public spending.

CivicLedger is a decentralized infrastructure protocol for the modernization of public sector procurement. Built on Stellar Soroban, it creates an authoritative on-chain record of the complete procurement lifecycle—from solicitation through competitive bidding, contract award, milestone verification, and performance-based disbursement.

Every stage is publicly auditable. Every fund movement is cryptographically verified. Corruption, favoritism, and "dark pools" of procurement information become structurally impossible.

---

## The Cost of Opaque Procurement

The World Bank estimates that corruption in public procurement costs governments $1 trillion annually. Inflated contracts, bid rigging, phantom vendors, and disbursements for undelivered work are endemic across both developing and developed economies. The root cause is information asymmetry: procurement happens in systems that only insiders can see.

CivicLedger makes procurement public by default. Not as a surveillance tool—but as a trustworthy, neutral ledger that any citizen, journalist, donor, or competing vendor can audit at any time.

---

## Protocol Architecture

### Tender Registry · `contracts/tender-registry`

The authoritative on-chain source for all public tenders.

- **Open Contracting Data Standard (OCDS)** — All tenders are structured to meet the OCDS specification, enabling seamless integration with existing government ERP and data systems.
- **State Machine** — Each tender progresses through a defined lifecycle: `Open → Bidding → Awarded → Active → Completed`. State transitions require authorized signatures and are irreversible.
- **Bid Confidentiality** — Bids are submitted as encrypted commitments and revealed simultaneously at the submission deadline, preventing last-minute manipulation.
- **Public Access** — Anyone can read the full tender history, awarded contract terms, and disbursement records without authentication.

### Milestone Escrow · `contracts/milestone-escrow`

A high-integrity, programmable disbursement engine.

- **Locked Funding** — Project capital is deposited to the escrow at contract award. Funds cannot be diverted, delayed, or accessed outside of verified milestone completions.
- **Multi-Party Verification** — Each milestone release requires a threshold of signatures from government officials, independent inspectors, and—optionally—the beneficiary community.
- **Tranche Architecture** — Large contracts are broken into discrete, verifiable deliverables. Partial completions receive proportional releases; failures trigger automatic remediation procedures.
- **Dispute Resolution** — Contested milestones trigger a time-locked arbitration period with on-chain evidence submission.

### Vendor Reputation · `contracts/vendor-reputation`

A non-transferable, objective contractor performance system.

- **Soulbound Credits** — Reputation credits are tied to a vendor's on-chain identity and cannot be bought, sold, or transferred. Only actual delivery earns credits.
- **On-Time Delivery** — Milestones completed on time and within scope earn positive credits. Delays, scope failures, and contract terminations generate proportional penalties.
- **Cross-Jurisdiction Portability** — A vendor's reputation score is global and interoperable across any CivicLedger deployment—municipal, national, or international.
- **Anti-Gaming** — The scoring algorithm accounts for contract size, complexity, and sector to prevent gaming through trivially small contracts.

---

## Repository Layout

```
.
├── apps/
│   ├── backend/        # Fastify event indexer and procurement API
│   └── web/            # Next.js 14 transparency dashboard
├── contracts/
│   ├── tender-registry/    # Tender lifecycle and bid management
│   ├── milestone-escrow/   # Programmable disbursement engine
│   └── vendor-reputation/  # Contractor performance tracking
├── docs/               # Protocol specification, OCDS mapping, audit trails
└── scripts/            # Deployment tools and government integration guides
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Rust | 1.78+ |
| Soroban CLI | 20+ |
| Node.js | 20+ |
| pnpm | 9+ |

### Build Smart Contracts

```bash
cargo build --target wasm32-unknown-unknown --release
```

### Run Tests

```bash
# Full test suite: tender lifecycle, escrow release, reputation scoring
cargo test --workspace
```

### Launch Dashboard

```bash
cd apps/web
pnpm install
pnpm dev
# Opens at http://localhost:3000 — real-time tender and fund tracking
```

---

## Procurement Lifecycle

| Stage | Description | Authorized Actors |
|-------|-------------|-------------------|
| **Solicitation** | Tender published on-chain with budget, scope, and timeline | Government entity |
| **Bidding** | Encrypted bids submitted; simultaneous reveal at deadline | Verified vendors |
| **Evaluation** | Automated compliance check; weighted scoring on-chain | Evaluation committee |
| **Award** | Winning bid triggers contract and escrow lock | Government + escrow |
| **Execution** | Milestones verified and funded in sequence | Auditors + inspectors |
| **Completion** | Final performance record written to Vendor Reputation | Protocol |

---

## Security Model

CivicLedger leverages Soroban's native authorization framework with the following guarantees:

- **Function-Level Access Control** — Only designated government officials can create tenders. Only registered vendors can submit bids. Only authorized auditors can sign milestone completions.
- **Immutable Audit Trail** — Every transaction carries a high-resolution timestamp and is permanently recorded on Stellar.
- **No Admin Keys** — There are no privileged backdoors or upgrade keys. Protocol behavior is determined solely by the deployed contract code.
- **Formal Verification** — Core escrow and reputation logic is targeted for formal verification before mainnet deployment.

---

## Contributing

CivicLedger welcomes contributions from developers, public sector experts, transparency advocates, and policy researchers. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

High-impact areas:
- Government ERP integration adapters (SAP, Oracle, custom)
- OCDS validator tooling
- Dashboard localization (priority: French, Arabic, Spanish, Portuguese)
- Formal verification of milestone escrow state machine

---

## License

MIT — designed to be deployed by anyone, anywhere.

---

*Transforming public goods into a transparent digital ecosystem.*
