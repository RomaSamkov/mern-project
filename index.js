import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validation.js";
import { UserController, PostController } from "./controllers/index.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => console.log("DB OK"))
  .catch((error) => console.log("DB error", error));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

app.get("/auth/current", checkAuth, UserController.getCurrent);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (error) => {
  if (error) {
    return console.log(error.message);
  }
  console.log("Server OK");
});
