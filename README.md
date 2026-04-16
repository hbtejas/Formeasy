# Forms Pro (MERN Monorepo)

## Structure

- client: React + Vite + TypeScript app
- server: Express + TypeScript + MongoDB API

## Quick Start

1. Copy env files:
   - server/.env.example -> server/.env
   - client/.env.example -> client/.env
2. Install dependencies:
   - npm install
3. Run in development:
   - npm run dev:server
   - npm run dev:client
4. Build:
   - npm run build

## Deploy

- Frontend: Vercel static build from client
- Backend: Railway/Render with server app
- Optional root vercel.json includes route rewrite for /api proxy

## API Base

- Backend API root: /api
- Health check: /health
