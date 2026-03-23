# Civicledger Architecture

## Overview
Three-layer architecture: Smart Contracts (Soroban) → Backend API (Fastify) → Frontend (Next.js).

## Contracts
- `tender-registry` — primary registry and state
- `milestone-escrow` — pooled resources management
- `vendor-reputation` — execution and settlement

## Data Flow
```
User → Frontend (Next.js) → Backend (Fastify) → Soroban RPC → Stellar Network
```
