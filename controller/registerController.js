import { uploadToCloudinary } from "../cloudinary/cloudinary.js";
import User from "../model/user.js";
// import { validationResult } from "express-validator";
// User Register
import cloudinary from "cloudinary";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

const register = async (req, res) => {
  console.log(req.file);
  try {
    let profilePictureUrl = null;

    if (req.file) {
      console.log("img");
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      profilePictureUrl = cloudinaryResult.secure_url;
      console.log(cloudinaryResult);
    }

    const {
      email,
      password,
      confirmPassword,
      phone,
      address,
      firstName,
      lastName,
    } = req.body;

    console.log(req.body);

    if (!password || !confirmPassword || !email || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res
        .status(401)
        .json({ message: "Email is already in use, try another" });
    }

    if (password !== confirmPassword) {
      return res
        .status(401)
        .json({ message: "Passwords don't match, please try again" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      address,
      profileImage: profilePictureUrl,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { register };

//   lOGIN

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .send({ message: "Email, password or both are incorrect" });
    }

    const passwordMatch = await (password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .send({ message: "User no found.! Please register" });
    }

    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//get all Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users) {
      res.status(200).send(users);
    } else {
      res.status(404).send({ message: "No users found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// get single user .

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updateSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const currentUser = await User.findById(id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // If a new file is uploaded, delete the old image from Cloudinary
    if (req.file) {
      if (currentUser.profileImage) {
        const publicId = cloudinary
          .url(currentUser.profileImage, { secure: true })
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.v2.uploader.destroy(publicId);
      }

      // Upload the new file to Cloudinary and update the profileImage in the database
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      updateData.profileImage = cloudinaryResult.secure_url;
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileImage) {
      const publicId = cloudinary
        .url(user.profileImage, { secure: true })
        .split("/")
        .pop()
        .split(".")[0];

      await cloudinary.v2.uploader.destroy(publicId);
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: `Deleted user and associated image` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
