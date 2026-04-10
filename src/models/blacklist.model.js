const mongoose = require("mongoose")
const { expectFailure } = require("node:test")

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token is required for blacklisting"],
    unique: true,
  }
}, {
  timestamps: true
})


tokenBlacklistSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 })// This index will automatically remove blacklisted tokens after 7 days (60 seconds * 60 minutes * 24 hours * 7 days)

const tokenBlacklistModel = mongoose.model("tokenBlacklist", tokenBlacklistSchema)

module.exports = tokenBlacklistModel