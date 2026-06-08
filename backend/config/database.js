const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set in .env");
    process.exit(1);
  }

  await mongoose
    .connect(uri)
    .then(() => console.log("Now you are connected to digitomize backend"))
    .catch((error) => {
      console.log(error.message);
      process.exit(1);
    });
}

module.exports = dbConnect;
