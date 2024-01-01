import { body } from "express-validator";

const registrationRules = () => [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body("phone")
    .notEmpty().withMessage("Phone is required")
    .matches(/^\d{11}$/).withMessage("Invalid phone number"), 
  body("address").notEmpty().withMessage("Address is required"),
];

export { registrationRules };
