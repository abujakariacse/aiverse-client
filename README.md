# AI Prompt Sharing & Marketplace Platform (Aiverse)

Aiverse is a modern, community-driven MERN stack application designed for discovering, sharing, bookmaking, testing, and monetizing AI prompt engineering templates. The platform supports multiple AI systems including ChatGPT, Gemini, Claude, and Midjourney, and enforces role-based workflow moderations.

## Purpose
AI prompts have become core assets in prompt engineering. Aiverse creates a secure, fast, and visually stunning workspace for engineers to publish, review, copy, and bookmark prompts, with a premium Stripe checkout system to unlock advanced (private) prompts.

## Live URL
- **Frontend App**: [https://aiverse-platform.netlify.app](https://aiverse-platform.netlify.app)
- **Backend API**: [https://aiverse-server.onrender.com](https://aiverse-server.onrender.com)

---

## Key Features

1. **Recruiter-Friendly Design**: Full custom Vanilla CSS styling utilizing a slate/violet dark theme, glassmorphism card panels (`backdrop-filter`), smooth Framer Motion entrance/hover micro-animations, and responsive layouts.
2. **Robust Authentication**: JWT session handling alongside Google Social Authentication (via Firebase Auth) with automatic user sync. Reloading pages maintains session validity.
3. **Role-Based Access Control (RBAC)**: Distinct layouts, dashboards, and API route protections for three roles:
   - **User**: Search, bookmark (without duplicates), copy templates, submit ratings/reviews, file reports, and manage saved items.
   - **Creator**: In-depth analytics dashboard, Recharts templates performance charts, base64 image uploading, and CRUD prompt management.
   - **Admin**: Overall analytics aggregation (MongoDB pipeline), user role modifications, payments logs, prompt moderations (with required rejection feedback text), and report resolution queues.
4. **Interactive Prompt Details**: Locks premium prompts using CSS blur states, requiring a Stripe payment. Includes copy trackers, review submission blocks, and report reasons (Copyright, Spam, Inappropriate) modals.
5. **Server-Side Operations**: Search by title/tags/tools, filter by category/difficulty, sort by latest/copied/popular, and paginated outputs (limit 6).
6. **Stripe Payments**: One-time $5 checkout charge updating user states to Premium. Includes simulated mock billing checkout for testing keyless environments.

---

## NPM Packages Used

### Client Dependencies (`client/`)
- `react-router-dom` (v6 routing and navigation links)
- `framer-motion` (for landing page card entries and testimonial sliders)
- `recharts` (creator and admin growth area graphs and bar charts)
- `react-toastify` (notification toasts for copy, bookmark, and auth feedbacks)
- `lucide-react` (modern minimalist SVG icon collection)
- `firebase` (client-side Google login OAuth popup)
- `@stripe/stripe-js` & `@stripe/react-stripe-js` (Stripe CardElement integrations)

### Server Dependencies (`server/`)
- `express` (routing and server app core)
- `mongoose` (Mongoose DB modeling and aggregation pipelines)
- `cors` (cross-origin resource headers sharing)
- `dotenv` (secure credentials storage)
- `jsonwebtoken` (session signing and header verification tokens)
- `bcryptjs` (password hashing)
- `stripe` (backend payment gateway processing)

---

## Running Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Connection URI
- Firebase Auth Web Config
- Stripe Developer API Credentials

### Installation

1. Clone the project.
2. **Configure Server**:
   ```bash
   cd server
   npm install
   # Create a .env file and set PORT, MONGODB_URI, JWT_SECRET, and STRIPE_SECRET_KEY
   npm run dev
   ```
3. **Configure Client**:
   ```bash
   cd ../client
   npm install
   # Create a .env file and set VITE_API_URL, VITE_STRIPE_PUBLIC_KEY, and VITE_FIREBASE_* keys
   npm run dev
   ```
