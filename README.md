# Prison Break RPG

A modern, real-time multiplayer browser game where players can choose to be either a Prisoner or a Police officer. Build your wealth, upgrade your facilities, and survive the city!

## Features

*   **Real-time Multiplayer:** Built with Socket.IO for instant updates across all clients.
*   **Roles:** Choose between 'Prisoner' or 'Police', each with different scaling for upgrades and actions.
*   **Actions:**
    *   **Work:** Earn money and experience points at the cost of stamina.
    *   **Steal:** High risk, high reward. Can earn you a lot of money, but getting caught will cost you money and switch your role to a Prisoner if you were Police.
    *   **Rest:** Recover your stamina over time, boosted by your room level.
*   **Upgrades:** Upgrade your Cell (Prisoner) or Break Room (Police) to increase your maximum stamina and resting recovery rate.
*   **Crafting:** Spend money to craft weapons (like a Shiv).
*   **Dynamic Role Switching:** Bribe the system to become Police, or get caught stealing to become a Prisoner.

## Tech Stack

*   **Backend:** Node.js, Express, Socket.IO, SQLite3
*   **Frontend:** React, Vite, Tailwind CSS, Socket.IO-client
*   **Deployment:** Docker, Docker Compose

---

## How to Run

### Option 1: Using Docker (Recommended)

1.  Make sure you have Docker and Docker Compose installed.
2.  Clone the repository and navigate to the root directory.
3.  Run the following command:
    ```bash
    docker-compose up --build
    ```
4.  Open your browser and navigate to `http://localhost`. The backend API runs on port `3000`.

### Option 2: Running Manually (Development Mode)

If you prefer to run the frontend and backend separately for development:

**1. Start the Backend:**
```bash
cd backend
npm install
node server.js
```
*The backend will start on `http://localhost:3000` and create a local SQLite database (`db.sqlite`).*

**2. Start the Frontend:**
Open a new terminal window/tab:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start on `http://localhost:5173`.*

## Project Structure

*   `/backend`: Contains the Node.js server, Socket.IO logic, and SQLite database setup.
*   `/frontend`: Contains the React application built with Vite and Tailwind CSS.
*   `docker-compose.yml`: Orchestrates the frontend and backend containers.
