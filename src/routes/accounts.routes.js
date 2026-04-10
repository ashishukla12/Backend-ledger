const express = require("express")
const authMiddleware = require("../middleware/auth.middleware").authMiddleware
const accountController = require("../controllers/account.controller")


const router = express.Router()

/**
 * - create a new account route
 * - POST /api/accounts
 * - protected route, requires authentication
*/

router.post("/", authMiddleware,accountController.createAccountController)

/**
 * - get all accounts of the authenticated user
 * - GET /api/accounts
 * - protected route, requires authentication
*/

router.get("/", authMiddleware, accountController.getUserAccountsController)

/**
 * - get account details by account id
 * - GET /api/accounts/balance/:accountId
 * - protected route, requires authentication
*/

router.get("/balance/:accountId", authMiddleware, accountController.getAccountBalanceController)


module.exports = router