# Architecture Overview

Road Rescue is split into two deployable apps:

- `frontend`: Next.js 14 customer and mechanic experience
- `backend`: Express API with Socket.io and MongoDB persistence

Core flows:

1. Customer creates an emergency booking.
2. Backend stores the booking and emits a live event.
3. Nearby mechanics receive the live request list.
4. A mechanic accepts the booking.
5. Customer receives ETA, tracking updates, chat, and payment status.
