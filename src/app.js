import express from "express";
import "dotenv/config";
import connectDB from "./config/connectDb.js";
import appealRoutes from "./routes/appealRoutes.js";

const app = express();
app.use(express.json());

const port = process.env.PORT;

connectDB();

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.use("/api/appeals", appealRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
