# Next-Generation AI Engineer Portfolio 🚀

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)

Welcome to the source code of my highly interactive, full-stack portfolio website. Designed to break away from traditional static portfolios, this application combines immersive 3D graphics, interactive data visualizations, and a custom-built headless CMS to showcase my work in AI/ML Engineering.

## ✨ Key Features

### 🎮 Immersive & Interactive Frontend
- **3D Robot Companion:** Integrated a custom Spline 3D scene. The robot tracks cursor movements and interacts dynamically with the user as they scroll through the hero section.
- **Interactive "Brain Map":** A custom physics-based network graph (built from scratch using HTML5 Canvas) that visually maps out my neural network of skills, tools, and cognitive domains. Nodes react to hover states and mouse physics.
- **Modern Bento-Box UI:** The entire interface utilizes a clean, high-contrast dark mode bento-box design system. Extensive use of CSS grid, subtle micro-animations, glassmorphism, and responsive breakpoints ensures a premium feel across all devices.

### ⚙️ Full-Stack Custom CMS & Admin Dashboard
Unlike most portfolios that hardcode data, this site is powered by a completely custom Content Management System (CMS) built directly into the application.
- **`/admin` Portal:** A hidden, secure dashboard to manage the portfolio's content on the fly.
- **Enterprise-Grade Security:** The admin portal is locked down using true **Supabase Authentication**. The PostgreSQL database utilizes strict **Row Level Security (RLS)** policies to ensure only authenticated sessions can mutate data.
- **Real-time Contact Inbox:** Form submissions are routed via **Web3Forms** for instant email notifications while simultaneously logging to a secure database inbox table.

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React 18, Vite |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Vanilla CSS (CSS Modules & Custom Properties) |
| **3D & Graphics** | Spline (`@splinetool/react-spline`) |
| **Database & Auth** | Supabase (PostgreSQL, GoTrue Auth) |
| **Form Handling** | Web3Forms |
| **Deployment** | Vercel |

## 🚀 Running Locally

If you'd like to run this project on your local machine, follow these steps:

### 1. Clone & Install
```bash
git clone https://github.com/kuldeep2911/portfolio-website.git
cd portfolio-website
npm install
```

### 2. Environment Variables
Duplicate the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```
Fill in the required variables with your own Supabase project and Web3Forms keys.

### 3. Database Migration
In your Supabase project's SQL Editor, run the `supabase_migration.sql` script located in the root of this repository. This will automatically set up the required tables (`profile`, `projects`, `skills`, `messages`, etc.) and establish all the secure Row Level Security policies.

### 4. Run the Dev Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## 📁 Architecture Overview

- **`/src/components/`**: Reusable UI blocks (HeroSection, ProjectsSection, BrainMapSection, etc.). Each section is designed to be fully modular.
- **`/src/pages/AdminPage.tsx`**: The control center. Handles Supabase Auth state, fetching data, and mutating the PostgreSQL database.
- **`/src/data/`**: Custom React hooks (`usePortfolioData.ts`) that handle the asynchronous fetching of content from Supabase, allowing the UI to remain entirely data-driven.
- **`/supabase_migration.sql`**: The single source of truth for the database schema, default seed data, and security policies.

---
*Designed and engineered with a focus on aesthetics, performance, and scalability.*
