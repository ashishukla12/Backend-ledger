# Backend Ledger System

This is a backend project where I built a **user authentication system and a transaction ledger system**.

---

## Features

* User Register and Login (JWT based authentication)
* Protected APIs using middleware
* Transaction system (transfer-like functionality)
* Ledger system (debit and credit entries)
* Idempotency (prevents duplicate transactions)
* MongoDB transactions for safe operations

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT

---

## Project Structure

```
src/
  controllers/
  models/
  routes/
  middleware/
  services/
```

---

## Setup

1. Install dependencies:

```
npm install
```

2. Create a `.env` file:

```
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key
```

3. Run the server:

```
npm run dev
```

---

## API Usage

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

### Protected Routes

Use token in headers:

```
Authorization: Bearer <your_token>
```

---

## Notes

* Token is required for protected routes
* System routes require special permission (system user)
* `.env` file is not included for security reasons

---
