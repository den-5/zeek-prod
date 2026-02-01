# ⚡ Real-Time Gaming Engine

> **⚠️ Archived Project (Winter 2023-2024)**
> This repository is a portfolio migration of a high-load gaming platform originally deployed on Vercel/Render.
> **Update (2025):** The codebase has been refactored, and dependencies (Next.js, Node.js) have been updated to the latest stable versions.

A high-performance multiplayer gaming platform built to demonstrate **real-time state synchronization** using WebSockets.
The project features a centralized wallet system with **ACID-compliant transaction logic**, optimistic UI updates, and a secure admin dashboard.

-----

# 📖 About

This project was engineered to solve the challenge of **handling high-frequency state updates** in web applications. Unlike traditional REST-based games, this engine utilizes a persistent WebSocket connection to push game results, balance updates, and multiplayer events to the client instantly, reducing latency to near-zero.

It implements a strict separation of concerns: logic validation happens entirely on the server (Node.js) to prevent client-side manipulation, while the frontend (Next.js) handles optimistic rendering for a smooth user experience.

-----

# 📸 Demo

The platform features three distinct game engines, each with unique logic handling.

| **Dice Engine** (Range Logic) | **Limbo Engine** (Multiplier Logic) | **Mines Engine** (Grid State) |
| :---: | :---: | :---: |
| ![Dice Demo](./assets/dice-demo.gif) | ![Limbo Demo](./assets/limbo-demo.gif) | ![Mines Demo](./assets/mines-demo.gif) |
| *Real-time probability calculation* | *Crash-point algorithm visualization* | *State-preserved grid interaction* |

-----

# ✨ Key Features

### 🛠️ Core Architecture
- **WebSocket Synchronization:** Implemented a custom `WebSocketService` to broadcast state changes to connected clients instantly.
- **Optimistic UI:** The Redux store updates immediately upon user interaction, rolling back only if the server returns an error, ensuring a "snappy" feel.
- **RNG Integrity:** Server-side generation of random outcomes using cryptographic libraries to ensure fairness and prevent prediction.

### 👤 Platform & Security
- **Secure Authentication:** Stateless JWT authentication with secure cookie storage and automatic token refresh.
- **Transactional Integrity:** The `Wallet` and `Transaction` models use MongoDB sessions to ensure funds are never lost or double-spent during concurrent requests.
- **Role-Based Access Control:** Dedicated Admin middleware protecting dashboard routes.

-----

# 🏗 Tech Stack

**Frontend**
- **Framework:** Next.js 14 (App Router)
- **State:** Redux Toolkit (Global Store)
- **Styling:** Tailwind CSS 3
- **UX:** Framer Motion (Animations)

**Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-time:** `ws` (Native WebSockets)
- **Database:** MongoDB (Mongoose)

**DevOps & Tools**
- **Linting:** ESLint + Prettier
- **Version Control:** Git

-----

# 🚀 Local Setup

To run the gaming engine locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/den-5/zeek-prod.git
cd zeek-prod
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure environment variables.

```bash
cd back
npm install

# Create .env file
echo "PORT=4000" > .env
# Replace with your actual MongoDB connection string
echo "DB_URL=mongodb+srv://YOUR_MONGO_URL" >> .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "ADMIN_SECRET=your_admin_secret_key" >> .env
echo "FRONTEND_URL=http://localhost:3000" >> .env

# Start the backend server
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the client.

```bash
cd front
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local

# Start the frontend
npm run dev
```

### 4. Explore
Open [http://localhost:3000](http://localhost:3000) to view the application.