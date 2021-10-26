const mongoose = require("mongoose");
const connectDB = () =>
  mongoose
    .connect(
      process.env.MONGODB_URI
    )
    .then(console.log("the database is connected"))
    .catch((err) => console.log(err))

module.exports=connectDB
