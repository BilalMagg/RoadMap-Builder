# 🗺️ Roadmap Builder

**Roadmap Builder** is a general-purpose, open-source web platform for designing interactive learning paths and workflows. Inspired by *roadmap.sh* but built for any domain, it allows users to create visual graphs, attach detailed content to nodes, and manipulate structures via a generic JSON format (similar to *n8n*).

## 🚀 Key Features

* **Visual Editor:** Drag-and-drop canvas powered by React Flow.
* **JSON Interoperability:** Copy/Paste graph segments as raw JSON; Import/Export full roadmaps.
* **Domain Agnostic:** Suitable for educational curriculums, project management, or marketing strategies.
* **Rich Content:** Nodes support descriptions, external links, and status tracking.
* **Secure:** Full authentication and private workspace management.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React (TypeScript)
* **Graph Engine:** React Flow
* **Testing:** Cypress (E2E)

### Backend
* **Runtime:** Node.js (Express + TypeScript)
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Testing:** Jest

### DevOps & Infrastructure
* **Containerization:** Docker
* **CI/CD:** GitHub Actions
* **Scripts:** Custom Shell Scripts for enhanced DX (Developer Experience)

---

## 📂 Project Architecture

The project follows a Monorepo-style structure containing the client, server, and automation tools.

```text
root/
├── .github/
│   └── workflows/      # CI/CD pipelines (Lint, Build, Test)
├── backend/            # Express API
│   ├── src/            # Source code (Feature-based structure)
│   ├── .env.example    # Environment variable template
│   ├── Dockerfile
│   └── package.json
├── frontend/           # React Client
│   ├── src/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── scripts/            # Automation tools (Scaffolding, Syncing)
│   ├── sync-env.sh
│   ├── scaffold-entity.sh
│   └── run-all.sh
└── README.md
```

### 🏗️ Backend Structure: Feature-Based

Unlike traditional MVC architectures that separate `controllers` and `routes` into different root folders, this project groups files by **Entity/Domain**. This keeps related logic together and improves scalability.

**Example Structure for a `Node` entity:**

~~~text
backend/src/node/
├── node.controller.ts  # Request handling
├── node.route.ts       # Route definitions
├── node.service.ts     # Business logic
├── node.dto.ts         # Data Transfer Objects (Validation)
├── node.registry.ts    # Dependency injection/Schema registry
├── node.entity.ts      # TypeORM Database Model
└── node.test.ts        # Unit tests for this specific domain
~~~

---

## ⚡ Getting Started

### Prerequisites
* **Node.js** (v18+)
* **Docker** & **Docker Compose**
* **Git**

### 1. Installation
Clone the repository:
~~~bash
git clone [https://github.com/your-org/roadmap-builder.git](https://github.com/your-org/roadmap-builder.git)
cd roadmap-builder
~~~

### 2. Environment Setup
We maintain a consistent environment using `.env.example`.
Use the helper script to safely generate your `.env` files. This script will create the files if they don't exist, or append new variables from the example without deleting your existing secrets.

~~~bash
# Give execution permissions
chmod +x scripts/sync-env.sh

# Run the sync script
./scripts/sync-env.sh
~~~

### 3. Running the App
You can run both the frontend and backend concurrently using our helper script:

~~~bash
./scripts/run-all.sh
~~~

Or run them individually:

**Backend:**
~~~bash
cd backend
npm install
npm run dev
~~~

**Frontend:**
~~~bash
cd frontend
npm install
npm run dev
~~~

---

## 🤖 Developer Experience (Scripts)

To maintain consistency and speed up development, we provide automation scripts in the `scripts/` folder.

### `sync-env.sh`
* **Usage:** `./scripts/sync-env.sh`
* **Description:** Synchronizes `.env` files with `.env.example`. It ensures all developers have the required environment variables defined.

### `scaffold-entity.sh`
* **Usage:** `./scripts/scaffold-entity.sh <EntityName>`
* **Description:** Automates backend boilerplate. It generates a new folder in `backend/src/<entity>/` containing:
    * `controller.ts`
    * `route.ts`
    * `dto.ts`
    * `registry.ts`
    * `test.ts`
* **Example:** `./scripts/scaffold-entity.sh comment` creates the full folder structure for comments.

### `run-all.sh`
* **Usage:** `./scripts/run-all.sh`
* **Description:** Runs both the Frontend and Backend servers simultaneously in development mode.

---

## 🧪 Testing

* **Unit Tests (Backend):**
  ~~~bash
  cd backend && npm run test
  ~~~
* **E2E Tests (Frontend):**
  ~~~bash
  cd frontend && npm run cypress:open
  ~~~

---

## 🤝 Contribution Guidelines

1.  **Branching:** Create a branch from `develop` named `feature/feature-name` or `fix/bug-name`.
2.  **Commits:** Use conventional commits (e.g., `feat: add node drag support`).
3.  **PRs:** Ensure CI checks (linting, tests) pass before requesting a review.