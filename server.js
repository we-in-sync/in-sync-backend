const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const server = app.listen(process.env.PORT, () => {
   console.log(`Server is listening...`);

   if (process.env.NODE_ENV == "development") {
      console.log(`Port: ${PORT}`);
   }
});
