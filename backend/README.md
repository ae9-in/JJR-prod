# Backend Structure

This backend is a separate Node.js service for the existing `sa-pooja-frontendd` app.

## Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication

## Folder layout

- `src/config`: environment and MongoDB connection
- `src/controllers`: request handlers
- `src/middleware`: auth, async, and error middleware
- `src/models`: Mongoose schemas for users, products, and orders
- `src/routes`: API route definitions
- `src/data`: seed data
- `src/scripts`: utility scripts such as database seeding

## API routes

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/orders`
- `POST /api/orders`

## Run locally

1. Copy `.env.example` to `.env`
2. Set `MONGODB_URI` to your MongoDB connection string
3. Install dependencies with `npm install`
4. Start the server with `npm run dev`

## MongoDB database

MongoDB creates the database automatically when this app connects using `MONGODB_URI` and writes data. With the default local connection, the database name will be `jaya_janardhana`.

To seed products after the database is reachable:

```bash
npm run seed
```
