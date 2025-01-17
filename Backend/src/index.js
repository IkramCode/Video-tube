import dotenv from "dotenv";
import connectDB from "./db/database.js";
import {app} from './app.js'

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error:", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening at ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
