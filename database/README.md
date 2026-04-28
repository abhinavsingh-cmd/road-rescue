# Database Notes

The application targets MongoDB and expects the `road_rescue` database by default.

Suggested collections:

- users
- mechanics
- bookings
- payments
- chats
- reviews
- notifications

Recommended indexes:

- `bookings.status`
- `bookings.customer`
- `bookings.mechanic`
- `mechanics.location.coordinates`
- `users.email`
- `mechanics.email`
