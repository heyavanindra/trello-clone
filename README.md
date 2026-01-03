
# Trello Clone

A full-stack implementation of a Trello-like task management application, built as a monorepo using Turborepo.

## 🚀 Tech Stack

- **Monorepo:** [Turborepo](https://turbo.build/repo)
- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), React 19, Tailwind CSS, Socket.IO Client.
- **Backend:** Node.js, Express, Socket.IO, MongoDB.
- **Package Manager:** pnpm.

## 🏗 Architecture Overview

This project is architected as a **Monorepo** using Turborepo, ensuring code sharing and type safety across the stack.

### System Design

```mermaid
graph TD
    User[User Client] <--> |HTTP / WebSocket| NextJS[Frontend (Next.js)]
    NextJS <--> |REST API| Backend[Backend API (Express)]
    NextJS <--> |Socket.IO Events| Socket[Socket Service]
    Backend <--> |Mongoose| DB[(MongoDB)]
    Socket <--> |Mongoose| DB
    
    subgraph "Shared Packages"
        Common[packages/common]
        Database[packages/database]
    end
    
    Backend -.-> Common
    NextJS -.-> Common
    Backend -.-> Database
    Socket -.-> Database
```

### Key Components

1.  **Frontend (`apps/frontend`)**:
    - Built with **Next.js 16 (App Router)** for server-side rendering and static generation.
    - Uses **Socket.IO Client** to listen for real-time events (e.g., `task-moved`, `task-created`) and update the UI instantly without refreshing.
    - Uses **Axios** for standard REST API operations like Authentication and initial data fetching.

2.  **Backend (`apps/backend`)**:
    - A centralized **Express.js** server that handles both HTTP requests and WebSocket connections.
    - **REST API**: Manages CRUD operations for Boards, Tasks, and Columns.
    - **Socket.IO Server**: Handles real-time communication. When a user updates a task (e.g., moves it), the server emits an event to all other users connected to that specific board.

3.  **Shared Common (`packages/common`)**:
    - Contains **Zod schemas** (for runtime validation) and inferred **TypeScript types**.
    - Ensures that the Frontend and Backend always agree on the data structure (e.g., a `Task` type is defined once and used everywhere).

4.  **Database Layer (`packages/database`)**:
    - Exports the database connection logic.
    - Contains **Mongoose Models** (`Board`, `Task`, `User`, etc.).
    - This allows the Backend to interact with the DB directly using typed models.

## 🛠 Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v18 or higher)
- **pnpm** (Version 9.0.0 or higher recommended)
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas/database) URI)

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/heyavanindra/trello-clone.git
    cd trello-clone
    ```

2.  **Install dependencies:**

    This project uses `pnpm`. If you don't have it, install it globally via `npm install -g pnpm`.

    ```bash
    pnpm install
    ```

## ⚙️ Environment Configuration

You need to configure environment variables for both the backend and frontend applications.

### 1. Backend (`apps/backend`)

Create a `.env` file in the `apps/backend` directory:

```bash
# apps/backend/.env

# Port for the backend server
PORT=5000

# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/trello-clone

# Secret key for JWT authentication
JWT_SECRET=your_super_secret_key

# Frontend URL for CORS configuration (No trailing slash)
FRONTEND_URL=http://localhost:3000
```

### 2. Frontend (`apps/frontend`)

Create a `.env.local` file in the `apps/frontend` directory:

```bash
# apps/frontend/.env.local

# URL of the backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🏃‍♂️ Running Locally

To start the development environment for all apps (frontend and backend) simultaneously:

```bash
pnpm dev
# or
turbo dev
```

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

## 🏗 Building for Production

To build all packages and applications:

```bash
pnpm build
```

## 📂 Project Structure

```
├── apps
│   ├── backend          # Express + Socket.IO server
│   └── frontend         # Next.js application
├── packages
│   ├── common           # Shared Typescript types/utils
│   ├── database         # Database schemas and connection logic
│   ├── eslint-config    # Shared ESLint configuration
│   └── typescript-config # Shared TSConfiguration
└── package.json         # Root package.json (Turborepo)
```