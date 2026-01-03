# GlobeTrotter 🌍✈️

A premium travel planning application built with Next.js 14, Prisma, and Tailwind CSS. Plan your trips, manage budgets, and discover new destinations with a beautiful, responsive interface.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- SQLite (default) or PostgreSQL database

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd globetrotter
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Ensure you have a `.env` file in the root directory.
    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="your-secret-key"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Database Setup**
    This command will reset the database and seed it with comprehensive travel data (15 cities, 4 users, historical trips).
    ```bash
    npm run db:push --force-reset
    npm run db:seed
    ```
    *Note: If you encounter errors, run `npx prisma generate` first.*

5.  **Run the Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to start exploring.

## 🔑 Login Credentials

The application is pre-seeded with the following users:

| Name | Email | Password | Role | Currency |
|------|-------|----------|------|----------|
| **John Traveler** | `john@example.com` | `password123` | User | INR (₹) |
| **Alice Wonder** | `alice@example.com` | `password123` | User | USD ($) |
| **Bob Builder** | `bob@example.com` | `password123` | User | EUR (€) |
| **Charlie Chaplin** | `charlie@example.com` | `password123` | User | GBP (£) |

## ✨ Features

- **Personalized Dashboard**: View upcoming trips, historical stats, and travel metrics.
- **Trip Planning Wizard**: Step-by-step creation of trips with destinations, dates, and budgets.
- **Interactive Calendar**: Visualize your trip itinerary with a dynamic event calendar.
- **Budget Tracking**: innovative budget management with real-time expense estimates.
- **Global Admin Analytics**: Platform-wide insights into user activity and popular destinations.
- **Comprehensive Data**: 15+ Cities, 120+ Activities, 45+ Hotels pre-loaded.

## 🛠️ Tech Stack & Tools

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **ORM**: Prisma
- **Styling**: Tailwind CSS, Lucide Icons
- **Auth**: NextAuth.js
