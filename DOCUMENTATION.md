# Stayly - Hotel & Travel Booking Application

Stayly is a premium, full-stack web application designed for seamlessly discovering and booking hotels, resorts, and travel destinations. With a modern, highly responsive design and built-in integration to real-world hotel data (via RapidAPI), Stayly offers users an elite travel planning experience.

## 🚀 Key Features

*   **Advanced Hotel Search**: Deeply integrated functional search bar that allows queries by destination, check-in/check-out dates, and guest demographics.
*   **Real-time Data Integration**: Features integration with the Booking.com RapidAPI for real hotel/property data and dynamic pricing.
*   **Responsive UI & Animations**: Built strictly with Tailwind CSS ensuring pixel-perfect layout across mobile and desktop interfaces, peppered with subtle micro-animations for luxurious aesthetics.
*   **Secure Authentication & Admin**: Fully connected Node.js/Express backend capable of JWT-based login tracking and role-based permissions context.
*   **Internationalization (i18n)**: Out-of-the-box infrastructure specifically designed to support multiple languages seamlessly.
*   **Rich Component Library**: Radix UI based components ensuring high accessibility standards (via elements like Modals, Toasts with `sonner`, complex Dropdowns).

---

## 🛠️ Technology Stack

### Frontend
*   **Framework**: React 19 (via Vite)
*   **Routing**: TanStack Router (File-based Routing structure)
*   **Styling**: Tailwind CSS + `clsx` / `tailwind-merge`
*   **State Management / Fetching**: React Hooks, TanStack React Query (`@tanstack/react-query`)
*   **Forms & Validation**: React Hook Form with Zod
*   **Icons & Notifications**: Lucide React, Sonner (Toasts)

### Backend
*   **Server**: Node.js & Express.js
*   **Database**: MongoDB (via Mongoose)
*   **Authentication**: JWT (JSON Web Tokens) & `bcryptjs`
*   **3rd-Party APIs**: Integration strictly with Axios/Node-Fetch grabbing external Booking.com logic.
*   **Payment & Email Utilities**: Stripe SDK configured alongside Nodemailer.

---

## 📂 Project Structure

```text
stay/
├── backend/                  # Express.js REST API
│   ├── .env                  # Backend Secrets (MongoDB URI, JWT, RapidAPI key)
│   ├── models/               # MongoDB Mongoose schemas (Hotel, Room, User)
│   ├── routes/               # Express specific path endpoints
│   ├── middleware/           # Security/Auth validators 
│   ├── server.js             # API Initialization 
│   └── package.json          
│
├── src/                      # React Frontend Application
│   ├── assets/               # Local static images and resources
│   ├── components/           # Reusable UI building blocks
│   │   └── ui/               # Radix UI implementations (buttons, popovers, etc.)
│   ├── contexts/             # Application global context (Auth, Theme)
│   ├── hooks/                # Specialized custom React utilities
│   ├── lib/                  # Generic utils and Dummy data fallbacks
│   ├── routes/               # TanStack File-Based Routes (Pages: Home, Search Results, Contact)
│   └── services/           # External API caller definitions (e.g., hotelService.js)
│
├── package.json              # Frontend Node dependencies
├── vite.config.ts            # Vite Configuration Engine
└── routeTree.gen.ts          # Auto-generated TanStack Route tree
```

---

## ⚙️ Getting Started & Setup

### 1. Prerequisites
Ensure you have the following installed locally:
*   [Node.js](https://nodejs.org/) (v18+)
*   [MongoDB](https://www.mongodb.com/) (Local client or Atlas URI)

### 2. Environment Variables Configuration
In the **frontend root directory** (`stay/`), ensure your `.env` contains:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

In the **backend directory** (`stay/backend/`), configure your `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/stay
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
RAPIDAPI_KEY=your_booking_com_rapidapi_key
STRIPE_SECRET_KEY=your_stripe_secret
```

### 3. Installation

**Build the Backend Layer:**
```bash
cd backend
npm install
npm run dev
# The backend server initializes typically on http://localhost:5000
```

**Build the Frontend Layer:**
Open a new integrated terminal window:
```bash
# Return to the root /stay
npm install
npm run dev
# The standard Vite development environment starts on http://localhost:5173
```

---

## 📝 Recent System Modifications
- **Search System Upgrade**: Integrated a `hotelService` that connects standard user input straight to RapidAPI’s external backend, outputting exact queries mapping to newly engineered loading-skeleton UI structures across `/search-results`.

## 🛡️ License
> This software is generated for private property scaling and proprietary application demonstrations.
