# NeoChef 🍲

**Recipe Recommendation Web App powered by a Neo4j graph model enabling personalized and context-aware recipe suggestions.** The project is designed as a scalable full-stack app demonstrating best real‑world backend, frontend, and DevOps practices.
> 🌐 Live at: **https://neochef.app**

---

## 🚀 Features

### 🧠 Backend
- **Personalized recommendation engine** built on a **Neo4j graph data model**, leveraging complex weighted Cypher queries (user similarity, ingredient and categories overlap, interaction weights).
- **Redis‑backed performance layer for reducing database load and response latency**:
  - Caching of CPU‑intensive recommendation queries and frequently used data
  - Trending page implemented with **Redis ZSETs** (leaderboard pattern)
  - Custom Redis‑backed **rate limiting** and **session storage**
- **Unit of Work pattern** for sharing transactional context across multiple repositories within a single service operation, ensuring consistency for multi‑step domain operations such as recipe imports
- **Background import service** with cron scheduling that ingests and normalizes recipes from the **Spoonacular API** (ETL workflow).
- **Production best practices**: layered architecture (routes → controllers → services → repositories), dependency injection, typed domain errors, global error handling, Zod validation, and full TypeScript coverage.

### 🎨 Frontend 
- **Modern React architecture** using **TanStack Query** and **TanStack Router** to enable advanced patterns like:
  - Route‑level prefetching and fetch‑on‑navigation
  - Client‑side caching and deterministic cache invalidation
  - Optimistic UI updates
- **Fully responsive and accessible UI** built with **Tailwind CSS** and **shadcn** components.
- **UX optimizations** such as skeleton loaders and smooth state transitions.

### ☁️ Infrastructure & Deployment
- **Monorepo setup** with npm workspaces (`client`, `common`, `server`) and shared types/utilities.
- **Backend containerized with Docker & Docker Compose**, running three services:
  - API server
  - Background import‑cron service
  - Redis
- **Frontend** deployed to **Vercel** with CDN distribution and automatic deployments.
- **Backend** deployed on an **Oracle VPS**.

---

## Tech Stack 🧱

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, TypeScript |
| Frontend | React, TanStack Query, TanStack Router, Tailwind CSS, shadcn |
| DevOps | Docker, Docker Compose, Vercel, VPS deployment |
| Architecture | Monorepo (npm workspaces), layered architecture, dependency injection, Unit Of Work |

---



