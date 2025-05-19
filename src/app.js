import express from "express";
import "dotenv/config";

const app = express();

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
