import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";

const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => console.log("DB OK"))
  .catch((error) => console.log("DB error", error));

const app = express();
app.use(express.json());

app.post("/auth/register", registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const doc = UserModel({
    email: req.body.email,
    passwordHash,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
  });

  const user = await doc.save();

  res.json(user);
});

app.listen(4444, (error) => {
  if (error) {
    return console.log(error.message);
  }
  console.log("Server OK");
});
