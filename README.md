# Road Rescue

Road Rescue is a full-stack emergency automobile repair and doorstep assistance platform inspired by the instant delivery speed of Blinkit and the dispatch/tracking model of Uber.

## Stack

- Next.js 14 + React + Tailwind CSS
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Socket.io for live events and chat
- Coordinate-based live maps and Stripe payment intent support

## Workspace Structure

- `frontend/` Next.js application
- `backend/` Express API and socket server
- `database/` database notes and collection guidance
- `docker/` Dockerfiles and compose setup
- `public/` shared brand assets
- `docs/` architecture and API notes

## Quick Start

1. Copy `.env.example` values into:
   - `backend/.env`
   - `frontend/.env.local`
2. Install dependencies:
   - `npm install`
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
3. Start the full workspace:
   - `npm run dev`

## Frontend

The frontend includes:

- Landing page
- Login and signup
- Customer dashboard
- Mechanic dashboard
- Booking flow
- Booking details with live tracking UI
- Profile, chat, support, contact, FAQ, terms, and privacy pages

## Backend

The backend includes:

- Express server with Socket.io
- MongoDB connection bootstrap
- Auth, booking, mechanic, payment, chat, review, and notification routes
- JWT middleware and role protection
- Mongoose models for all required entities
- Geospatial mechanic matching and payment intent creation

## Docker

Use the files in `docker/` for containerized local development.

## Notes

- Booking, profile, chat, notification, payment, and review data are persisted in MongoDB.
- The project uses a mobile-first design system with reusable layouts, cards, and dashboards.
