import express from 'express';
import multer from 'multer';  // Use import for multer

import { register, login, getAllUsers, updateSingleUser, deleteUser, getSingleUser } from '../controller/registerController.js';
import { registrationRules } from '../validation/validation.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// user routes
router.post("/user/register", upload.single("profileImage"), register);
router.post("/user/login", login);
router.get("/user/allusers", getAllUsers);
router.get('/user/:id', getSingleUser);
router.put("/user/:id", upload.single("profileImage") , updateSingleUser);
router.delete("/user/:id", deleteUser);

export default router;
