# API Surface

Base URL: `/api`

## Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

## Bookings

- `GET /bookings`
- `POST /bookings`
- `GET /bookings/:id`
- `PATCH /bookings/:id/status`
- `PATCH /bookings/:id/assign-mechanic`

## Mechanics

- `GET /mechanics`
- `POST /mechanics/signup`
- `POST /mechanics/login`
- `GET /mechanics/dashboard/summary`

## Chat

- `GET /chats/:bookingId`
- `POST /chats/:bookingId/messages`

## Reviews

- `POST /reviews`

## Notifications

- `GET /notifications`
