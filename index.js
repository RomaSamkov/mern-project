import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import { registerValidation, loginValidation } from "./validation.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => console.log("DB OK"))
  .catch((error) => console.log("DB error", error));

const app = express();
app.use(express.json());

app.post("/auth/login", loginValidation, UserController.login);

app.post("/auth/register", registerValidation, UserController.register);

app.get("/auth/current", checkAuth, UserController.getCurrent);

app.listen(4444, (error) => {
  if (error) {
    return console.log(error.message);
  }
  console.log("Server OK");
});
