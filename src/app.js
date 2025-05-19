import express from "express";
import "dotenv/config";
import connectDB from "./config/connectDb.js";

const app = express();

const port = process.env.PORT;

connectDB();

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
