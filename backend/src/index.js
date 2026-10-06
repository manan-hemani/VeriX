import connectDB from "./db/dbConnection.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process?.env?.PORT || 3000, () => {
      console.log(`Server is running on port number ${process?.env?.PORT}`);
    });
  })
  .catch((error) => {
    console.log("index :: connectDB", error);
  });
