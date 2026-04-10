require("dotenv").config() // could not use process.env without this line

const app = require("./src/app")
const connectTODB = require("./src/config/db")

connectTODB()



app.listen(3000, ()=>{
  console.log("Server is running on port 3000")
})