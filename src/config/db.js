const mongoose = require('mongoose');



function connectTODB() {

    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      console.log("server is connected to DB")
    })
    .catch((err) => {
      console.log("Error connecting to DB", err)
      process.exit(1) // exit the process with failure code
    })

}


module.exports = connectTODB