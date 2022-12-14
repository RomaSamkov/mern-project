import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

export const registerValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("fullName").isLength({ min: 3 }),
  body("avatarUrl").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "Enter title").isLength({ min: 3 }),
  body("text", "Enter text").isLength({ min: 10 }),
  body("tags", "Enter array of tags").optional(),
  body("imageUrl", "Enter correct url").optional().isString(),
];
