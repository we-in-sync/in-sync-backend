const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const mongoose = require("mongoose");
const app = require("./app");

const DB =
   process.env.NODE_ENV === "production"
      ? process.env.REMOTE_DB_CONNECTION.replace(
           "<PASSWORD>",
           process.env.REMOTE_DB_PASSWORD
        )
      : process.env.LOCAL_DB;

mongoose
   .connect(DB)
   .then(() => {
      console.log("Connected successfully to the Database.");
   })
   .catch((error) => {
      console.log(error);
   });

const PORT = process.env.PORT || 5000;
const server = app.listen(process.env.PORT, () => {
   console.log(`Server is listening...`);

   if (process.env.NODE_ENV == "development") {
      console.log(`Port: ${PORT}`);
   }
});
