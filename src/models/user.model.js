const { timeStamp } = require('console');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { type } = require('os');


const userSchema = mongoose.Schema({
    email:{
      type: String,
      required: [true,"Email is required for creating a user"],
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please fill a valid email address"],
      unique: [true,"Email already exists, please use a different email"]
    },
    name: {
      type: String,
      required: [true,"Name is required for creating a user"],
    },
    password: {
      type: String,
      required: [true,"Password is required for creating a user"],
      minlength: [6,"Password must be at least 6 characters long"],
      select: false // to exclude password field when fetching user data
    },
    systemUser: {
      type: Boolean,
      default: false,
      immutable: true, // to prevent changes to this field after user creation
      select: false // to exclude systemUser field when fetching user data
    }
},{
    timestamps: true
})


userSchema.pre('save', async function(){

  if(!this.isModified('password')){ // if password is not modified, move to next middleware
    return
  }

  const hash = await bcrypt.hash(this.password, 10) // hash the password with salt rounds of 10
  
  this.password = hash // replace the plain text password with the hashed password

  return // move to next middleware after hashing the password

})


userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password) // compare the provided password with the hashed password in the database
}

const userModel = mongoose.model("user",userSchema)

module.exports = userModel