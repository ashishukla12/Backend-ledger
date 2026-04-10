const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function authMiddleware(req,res,next){

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1] // to support both cookie and header based token authentication

  if(!token){
    return res.status(401).json({
      message: "Unauthorized, token is missing"
    })
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token })

  if(isBlacklisted){
    return res.status(401).json({
      message: "Unauthorized, token is blacklisted"
    })
  }
  
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findById(decoded.userId)

    req.user = user

    return next()

  }catch(err){
    return res.status(401).json({
      message: "Unauthorized, invalid token"
    })
  }
}

async function authSystemUserMIddleware(req,res,next){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1] // to support both cookie and header based token authentication

  if(!token){
    return res.status(401).json({
      message: "Unauthorized, token is missing"
    })
  }

  if(!token){
    return res.status(401).json({
      message: "Unauthorized, token is missing"
    })
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token })

  if(isBlacklisted){
    return res.status(401).json({
      message: "Unauthorized, token is blacklisted"
    })
  }
  
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findById(decoded.userId).select("+systemUser") // to include systemUser field in the user document

    if(!user.systemUser){
      return res.status(403).json({
        message: "Forbidden, only system users can access this resource"
      })
    }

    req.user = user

    return next()

  }catch(err){
    return res.status(401).json({
      message: "Unauthorized, invalid token"
    })
  }
}

module.exports = {authMiddleware, authSystemUserMIddleware}