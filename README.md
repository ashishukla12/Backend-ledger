# Backend Ledger System

Ye ek backend project hai jisme maine **user authentication + transaction system + ledger system** banaya hai.

---

## Features

* User Register & Login (JWT token)
* Secure APIs (Authentication middleware)
* Transaction system (money transfer type)
* Ledger system (debit & credit entries)
* Idempotency (same request repeat nahi hoga)
* MongoDB transactions (safe operations)

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

2. Create `.env` file:

```
MONGO_URI=your_db_url
JWT_SECRET=your_secret
```

3. Run server:

```
npm run dev
```

---

## API Use

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

### Protected API

```
Authorization: Bearer <token>
```

---

## Important

* Token login ke baad milega
* Protected routes me token bhejna zaroori hai
* System routes ke liye special user chahiye

---

## Author

Ashish Shukla
