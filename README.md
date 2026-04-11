# Domislink Academy PWA

A Progressive Web App (PWA) for online learning — built with React and Vite.

## Features

- 🎓 **Course Catalog** — browse and filter courses by category and level
- 📱 **PWA Ready** — installable on mobile and desktop, works offline
- ⚡ **Fast** — Vite-powered build with hot module replacement in dev
- ♿ **Accessible** — semantic HTML and ARIA attributes throughout

## Tech Stack

- **React 19** + **React Router 7**
- **Vite 8**
- **Service Worker** (cache-first strategy for offline support)
- **Web App Manifest** for install prompts

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Pages

- `/` — Home (hero, features, featured courses)
- `/courses` — Full course catalog with search and filters
- `/about` — About the academy, team, and PWA details
