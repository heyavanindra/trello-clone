
# Trello Clone

A full-stack implementation of a Trello-like task management application, built as a monorepo using Turborepo.

## 🚀 Tech Stack

- **Monorepo:** [Turborepo]
- **Frontend:** [Next.js 16] (App Router), React 19, Tailwind CSS, Socket.IO Client.
- **Backend:** Node.js, Express, Socket.IO, MongoDB.
- **Package Manager:** pnpm.

## 🛠 Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v18 or higher)
- **pnpm** (Version 9.0.0 or higher recommended)
- **MongoDB** (Local instance or [MongoDB Atlas] URI)

## Installation

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



## Running Locally

clone this repository and run the following commands:

```bash
pnpm install
```

Create `.env` files in both the `apps/backend` and `apps/frontend` directories using the fields from `.env.example`.

run the following commands:

```bash
pnpm run dev
``` 

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

## Building for Production

To build all packages and applications:

```bash
pnpm build
```

## Project Structure

```
├── apps
│   ├── backend          # Express + Socket.IO server
│   ├── frontend         # Next.js application
├── packages
│   ├── common           # Shared Typescript types/utils
│   ├── database         # Database schemas and connection logic
│   ├── eslint-config    # Shared ESLint configuration
│   └── typescript-config # Shared TSConfiguration
└── package.json         # Root package.json (Turborepo)
```

## Architecture

### 1. Project Architecture Overview

The project follows a **Monorepo** structure managed by **TurboRepo** and **PNPM**:

*   **Apps**:
    *   `apps/backend`: Node.js/Express server handling business logic, database interactions, and real-time sockets.
    *   `apps/frontend`: Next.js 14+ (App Router) client for UI and state management.
*   **Packages** (Shared):
    *   `packages/database`: Mongoose models (`User`, `Workspace`, `Board`, `Task`, `WorkspaceMember`) and connection logic.
    *   `packages/common`: Shared Zod schemas and TypeScript types.
    *   `packages/ui`: Shared UI components.

### 2. RBAC (Role-Based Access Control) Implementation

The RBAC system defines permissions based on the relationship between a `User` and a `Workspace`.

#### Database Schema
*   **WorkspaceMember**: Links `userId` and `workspaceId` with a `role` enum (`['OWNER', 'ADMIN', 'MEMBER']`). Default is `'MEMBER'`.

#### Backend Logic
*   **Authentication**: `authMiddleware` validates JWT tokens and attaches `req.userId`.
*   **Role Identification**: The endpoint `GET /api/boards/role/:workspaceSlug` queries the `WorkspaceMember` collection for the user's role.
*   **Authorization**:
    *   **Explicit**: Controllers (e.g., `inviteUserToWorkspace`) manually check if `workspace.ownerId` matches the requester.
    *   **Implicit**: Read operations filter results based on database membership.

#### Frontend Logic
*   **Role Retrieval**: The board page fetches the user's role on load.
*   **Conditional Rendering**: Components receive the `role` prop to conditionally render actions like **Delete** or **Edit**.

### 3. Socket.io & Real-Time Flow

Real-time updates use a room-based architecture in Socket.io.

#### Connection & Auth
*   **Client**: Sends JWT token during handshake.
*   **Server**: Middleware verifies the token and attaches `socket.userId`.

#### Room Management
*   Clients emit `join-board` with `boardSlug` to join specific rooms.

#### Event Flow (e.g., Moving a Task)
1.  **Frontend**: User drags task -> `socket.emit("task-moved")` -> Optimistic UI update.
2.  **Server**: Listens for event -> Broadcasts `task-updated` to room -> Updates MongoDB asynchronously.
3.  **Clients**: Receive `task-updated` -> Update local state.

### 4. API Flow

Follows a RESTful Controller-Service pattern:

1.  **Request**: Frontend Axios call.
2.  **Routing**: Express routes apply `authMiddleware`.
3.  **Controller**: Validates input (Zod), checks permissions, performs DB operations (Mongoose).
4.  **Response**: JSON data returned to client.
