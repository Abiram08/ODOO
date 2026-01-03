<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
</p>

<h1 align="center">🌍 GlobeTrotter</h1>

<p align="center">
  <strong>A comprehensive travel planning platform for creating, managing, and sharing multi-city itineraries</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#database-schema">Database</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API</a>
</p>

---

## 📋 Overview

GlobeTrotter is a full-stack travel planning application that enables users to create detailed multi-city trip itineraries with smart budget allocation, activity planning, accommodation booking, and public sharing capabilities. Built with modern web technologies and designed for scalability.

### Key Highlights

- 🎯 **Smart Trip Wizard** - 4-step guided trip creation with intelligent suggestions
- 💰 **Budget Intelligence** - Auto-allocation based on travel style (budget/balanced/luxury)
- 🏨 **Comprehensive Planning** - Hotels, restaurants, activities, and transport in one place
- 🔗 **Public Sharing** - Share trips with the community or via private links
- 📊 **Admin Analytics** - Real-time platform insights with Recharts visualizations

---

## ✨ Features

### User Features

| Feature | Description |
|---------|-------------|
| **Multi-City Itineraries** | Plan trips across multiple destinations with day-by-day scheduling |
| **Smart Budget Breakdown** | Automatic allocation across transport, accommodation, food, activities, misc |
| **Activity Discovery** | Browse and add activities with ratings, costs, and duration |
| **Accommodation Selection** | Choose hotels with price-per-night calculations |
| **Restaurant Recommendations** | Curated food options by cuisine and price range |
| **Transport Planning** | Flights/trains between consecutive cities |
| **Auto-Fill Suggestions** | AI-powered activity recommendations based on budget and style |
| **Public Trip Sharing** | Make trips public for community inspiration |
| **Trip Versioning** | Track changes with version history |

### Admin Features

| Feature | Description |
|---------|-------------|
| **User Analytics** | Total users, active trips, engagement metrics |
| **Revenue Dashboard** | Subscription tier breakdown with charts |
| **Platform Growth** | Time-series visualization of platform metrics |
| **Content Management** | Manage cities, activities, and destinations |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | Full-stack React framework with App Router & Turbopack |
| **React** | 19.2.3 | UI library with Server Components support |
| **TypeScript** | 5.x | Type-safe development |
| **TailwindCSS** | 4.0 | Utility-first styling with JIT compilation |
| **Lucide React** | 0.562 | Beautiful, consistent icon library |
| **Recharts** | 3.6.0 | Data visualization for analytics |
| **date-fns** | 4.1.0 | Date manipulation and formatting |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **Prisma ORM** | 6.19.1 | Type-safe database client with migrations |
| **SQLite** | - | Development database (PostgreSQL for production) |
| **NextAuth.js** | 5.0 (beta) | Authentication with JWT sessions |
| **bcryptjs** | 3.0.3 | Secure password hashing |
| **Zod** | 4.3.4 | Runtime schema validation |

### State Management

| Technology | Purpose |
|------------|---------|
| **Zustand** | Lightweight global state management |
| **TanStack Query** | Server state caching and synchronization |
| **React Hook Form** | Form state with validation |

### Dev Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and style enforcement |
| **Prettier** | Code formatting |
| **tsx** | TypeScript execution for scripts |

---

## 🏗 Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Pages      │  │  Components  │  │    Hooks     │              │
│  │  (App Router)│  │   (React)    │  │  (Zustand)   │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
└─────────┼─────────────────┼─────────────────┼───────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP ROUTER                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    API Routes (/api/*)                       │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐  │   │
│  │  │ /trips  │ │ /cities │ │/hotels  │ │/activities│ │ /auth │  │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └───────┘  │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Auth       │  │   Business   │  │  Validation  │              │
│  │  (NextAuth)  │  │    Logic     │  │    (Zod)     │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
└─────────┼─────────────────┼─────────────────┼───────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      PRISMA ORM                              │   │
│  │              Type-safe queries & migrations                  │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   SQLite / PostgreSQL                        │   │
│  │   Users │ Trips │ Cities │ Hotels │ Activities │ Transport  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
globetrotter/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.ts                # Seed data for development
├── src/
│   ├── app/
│   │   ├── (main)/            # Authenticated routes (dashboard, trips)
│   │   │   ├── dashboard/
│   │   │   └── trips/
│   │   │       ├── [id]/      # Trip details
│   │   │       └── new/       # Trip creation wizard
│   │   ├── admin/             # Admin panel
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── trips/
│   │   │   ├── cities/
│   │   │   ├── hotels/
│   │   │   ├── activities/
│   │   │   └── restaurants/
│   │   ├── login/
│   │   ├── register/
│   │   └── public/            # Public pages (trips explorer)
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   └── db.ts              # Prisma client instance
│   └── generated/
│       └── client/            # Generated Prisma types
├── .env                       # Environment variables
├── package.json
└── tsconfig.json
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│    USER      │────────▶│    TRIP      │
│  • email     │ 1    n  │  • name      │
│  • password  │         │  • startDate │
│  • roles     │         │  • budget    │
│  • prefs     │         │  • isPublic  │
└──────────────┘         └──────┬───────┘
       │                        │ 1
       │                        │
       ▼                        ▼ n
┌──────────────┐         ┌──────────────┐
│    ROLE      │         │  TRIP_STOP   │
│  • name      │         │  • cityId    │◀────────┐
│  • perms     │         │  • duration  │         │
└──────────────┘         │  • order     │         │
                         └──────┬───────┘         │
                                │ 1               │
                                ▼ n               │
                         ┌──────────────┐         │
                         │STOP_ACTIVITY │         │
                         │  • activityId│         │
                         │  • date      │         │
                         │  • cost      │         │
                         └──────────────┘         │
                                                  │
┌──────────────┐         ┌──────────────┐         │
│    CITY      │────────▶│  ACTIVITY    │         │
│  • name      │ 1    n  │  • name      │         │
│  • country   │─────────│  • cost      │         │
│  • costIndex │    │    │  • rating    │         │
│  • coords    │    │    │  • duration  │         │
└──────────────┘    │    └──────────────┘         │
       │            │                             │
       │            │    ┌──────────────┐         │
       │            └───▶│    HOTEL     │─────────┤
       │            │    │  • name      │         │
       │            │    │  • stars     │         │
       │            │    │  • price     │         │
       │            │    └──────────────┘         │
       │            │                             │
       │            │    ┌──────────────┐         │
       │            └───▶│ RESTAURANT   │─────────┤
       │            │    │  • cuisine   │         │
       │            │    │  • rating    │         │
       │            │    └──────────────┘         │
       │            │                             │
       │            │    ┌──────────────┐         │
       └────────────┴───▶│  TRANSPORT   │─────────┘
                         │  • type      │
                         │  • price     │
                         │  • operator  │
                         └──────────────┘
```

### Core Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Authentication & profile | email, password, roles, preferences |
| **Trip** | Travel itinerary | name, dates, budget, status, isPublic |
| **TripStop** | Destination in trip | cityId, duration, order, accommodation |
| **City** | Location catalog | name, country, coordinates, costIndex |
| **Activity** | Things to do | name, cost, duration, rating, category |
| **Hotel** | Accommodation options | name, stars, pricePerNight, amenities |
| **Restaurant** | Dining options | name, cuisine, rating, priceRange |
| **Transport** | Travel between cities | type, operator, price, schedule |

---

## 🧠 Core Logic

### 1. Smart Budget Allocation

The budget system automatically distributes the total budget across categories based on travel style:

```typescript
// Budget allocation percentages by travel style
const allocations = {
    budget:   { transport: 25%, accommodation: 25%, food: 25%, activities: 15%, misc: 10% },
    balanced: { transport: 20%, accommodation: 30%, food: 20%, activities: 20%, misc: 10% },
    luxury:   { transport: 15%, accommodation: 40%, food: 15%, activities: 20%, misc: 10% }
};

// Computed breakdown
const budgetBreakdown = {
    transport: Math.round(totalBudget * allocation.transport),
    accommodation: Math.round(totalBudget * allocation.accommodation),
    // ... etc
};
```

### 2. Activity Auto-Fill Algorithm

The auto-fill feature intelligently selects activities based on budget constraints and travel style:

```typescript
const autoFillPlan = () => {
    const activityBudget = budgetBreakdown.activities;
    const budgetPerDay = activityBudget / totalDays;

    dayPlan.map(day => {
        // 1. Filter activities for this city
        const cityActivities = activities.filter(a => a.cityId === day.cityId);

        // 2. Score based on travel style AND budget fit
        const scored = cityActivities.map(a => {
            let score = a.rating;
            
            // Penalize activities exceeding daily budget
            if (a.cost > budgetPerDay * 0.5) score -= 1;
            if (a.cost > budgetPerDay) score -= 3;

            // Style preferences
            if (travelStyle === "budget" && a.cost < 1000) score += 2;
            if (travelStyle === "luxury" && a.cost > 3000) score += 2;

            return { ...a, score };
        }).sort((a, b) => b.score - a.score);

        // 3. Select activities within daily budget
        const selected = [];
        let daySpend = 0;
        for (const act of scored) {
            if (selected.length >= 3) break;
            if (daySpend + act.cost <= budgetPerDay) {
                selected.push(act);
                daySpend += act.cost;
            }
        }
        return { ...day, activities: selected };
    });
};
```

### 3. Day Plan Generation

Automatically generates a day-by-day structure based on selected cities and durations:

```typescript
const generateDayPlan = () => {
    const plan = [];
    let currentDate = new Date(startDate);

    selectedCities.forEach(city => {
        for (let d = 0; d < city.days; d++) {
            plan.push({
                date: format(currentDate, "yyyy-MM-dd"),
                cityId: city.id,
                cityName: city.name,
                activities: []
            });
            currentDate = addDays(currentDate, 1);
        }
    });

    return plan;
};
```

### 4. Public Sharing System

Trips can be made public and shared via unique URLs:

```typescript
// Toggle public visibility
const togglePublic = async () => {
    await fetch(`/api/trips/${tripId}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublic: !isPublic })
    });
};

// Generate share link
const shareUrl = `${origin}/public/${tripId}`;
await navigator.clipboard.writeText(shareUrl);
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/globetrotter.git
cd globetrotter

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Initialize database
npx prisma db push

# 5. Seed sample data
npx prisma db seed

# 6. Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| demo@globetrotter.com | password123 | User |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/session` | Get current session |

### Trips

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | List user's trips |
| POST | `/api/trips` | Create new trip |
| GET | `/api/trips/:id` | Get trip details |
| PATCH | `/api/trips/:id` | Update trip |
| DELETE | `/api/trips/:id` | Delete trip |
| GET | `/api/trips/public` | List public trips |

### Catalog

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cities` | List cities |
| GET | `/api/activities?cityId=` | Activities by city |
| GET | `/api/hotels?cityId=` | Hotels by city |
| GET | `/api/restaurants?cityId=` | Restaurants by city |
| GET | `/api/transport?from=&to=` | Transport options |

---

## 📁 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

---

## 🔐 Security

- **Authentication**: NextAuth.js with JWT sessions
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schemas on all API routes
- **CSRF Protection**: Built-in Next.js protection
- **SQL Injection**: Prisma parameterized queries

---


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by the GlobeTrotter Team
</p>
