const express = require('express');
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const accountsRouter = require("./routes/accounts.routes")
const transactionRoutes = require("./routes/transaction.routes")




const app = express()



app.use(cookieParser()) // to parse cookies from incoming requests, making them available under req.cookies in route handlers and middleware. This is essential for handling authentication tokens stored in cookies, allowing the server to read and verify them for user authentication and session management.
app.use(express.json())// to parse incoming JSON data as a middleware before handling the routes. This allows the server to understand and process JSON payloads sent in the body of HTTP requests, making it easier to work with data in a structured format when creating or updating resources through the API.
app.use("/api/auth", authRouter)
app.use("/api/accounts", accountsRouter)
app.use("/api/transactions", transactionRoutes)


module.exports = app;