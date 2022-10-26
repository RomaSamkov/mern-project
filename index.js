import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => console.log("DB OK"))
  .catch((error) => console.log("DB error", error));

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);
  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: "User",
    },
    "secret"
  );
  res.json({
    message: "success",
    token,
  });
});

app.listen(4444, (error) => {
  if (error) {
    return console.log(error.message);
  }
  console.log("Server OK");
});
