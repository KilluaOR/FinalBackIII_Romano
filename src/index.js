import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 3000;
mongoose.set('strictQuery', false);

try {
  await mongoose.connect(process.env.DATABASE);
  console.log("Database conection success!");
} catch (error) {
  console.error(error);
  process.exit(1);
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
