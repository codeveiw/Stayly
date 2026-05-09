# Stayly - Project Documentation

This document outlines all the **actively working features** in the Stayly project, how they operate under the hood, and how the core logic is structured. It is guaranteed to only mention features that are 100% functional and implemented.

---

## 🏗️ Core Architecture (How it works)

Currently, the project functions independently of an external backend server by utilizing a **Robust LocalStorage Mock API (`src/lib/api.ts`)**. 

1. **Auto-Migration System (`initMockEngine`)**:
   When the application is launched for the very first time on any device (or downloaded newly from GitHub), the API engine automatically initializes standard databases (Users, Bookings, Hotels) directly into the browser's Local Storage.
2. **Missing Image Recovery**:
   The engine automatically cycles through missing hotel image IDs and ensures that valid, working images are attached and synchronized before the application renders.
3. **Session Management**:
   The `ApiClient` simulates network delays (e.g., `delay(400)`) to provide a realistic loading user experience. Sessions are managed by pushing a mock token linking to standard users.

---

## ✨ Fully Functional Features

### 1. 🏨 Search & Discovery (Hotel Catalog)
* **Functional Database**: An expansive offline default catalog consisting of **26 Premium Hotels** spread out globally across more than **10 tourist countries** including Egypt, USA, France, Japan, UAE, Greece, Italy, Turkey, Maldives, Spain, Thailand, and the UK.
* **Smart Search Bar**: The top search bar actively works and filters the catalog correctly by **Hotel Name**, **City**, or **Country**.
* **Dynamic Listing Pages**: Hotels are displayed as rich cards with dynamic prices, high-quality images, review counts, stars, and locations.
* **Dedicated Hotel View (`getHotelById`)**: Users can click on a hotel to see detailed specifics, amenities (WiFi, Pool, etc.), and distinct "mock" Room Categories.

### 2. 🔐 Authentication System
* **User Registration**: Users can create a new account using an email, name, and password. The system checks against duplicate emails.
* **User Login**: Secure simulated login verifying credentials against LocalStorage.
* **Persistent Sessions**: Once logged in, the user stays logged in across page refreshes until they choose to log out. There is a specific fallback admin assigned to `admin@stayly.com`.

### 3. 📅 Booking System (User Dashboard)
* **Checkout/Booking Engine**: Connected cleanly to the Hotel pages. Users can simulate picking dates, passengers, and making a booking.
* **My Bookings (`/profile`)**: Currently logged-in ordinary users can open their active bookings view to see all historical reservations.
* **Cancellations**: A user can click to "Cancel" their booking, which instantly shifts the specific booking status from "Confirmed" to "Cancelled" in the database.

### 4. 🎛️ Admin Panel
There exists a robust admin dashboard interface that reads from the entire local storage ecosystem.
* **Admin Statistics**: Displays aggregate analytical numbers for **Total Users**, **Active/Total Bookings**, and **Total Platform Revenue**.
* **Global Users List**: Allows admins to view everyone who has registered on the platform.
* **Booking Management**: Admins have an interactive table displaying all live platform bookings globally where they can **Change Booking Statuses** (e.g. Approve, Reject, Cancel).
* **Accommodations Catalog**: Admins have view-access to all cached hotels.

### 5. 🌍 Internationalization & Static Content
* **Multilingual Menu**: Support for internationalization toggles which interact seamlessly with the existing translation systems.
* **Static Read-Only Pages**: Premium standalone information pages are fully routed via TanStack Router:
  * About Us
  * Contact Us
  * Terms & Conditions

---

## 🛠️ Excluded / Work in Progress
*(Note: As per requirements, components missing logic completely such as the `Flights` page module — which is currently disabled/commented out — are not marketed inside this functional scope document).*
