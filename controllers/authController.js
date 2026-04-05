import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import logger from "../config/logger.js";
import { validatePassword, validateEmail } from "../utils/validators.js";

export const register = async (req, res) => {
   logger.info("enter in register api")
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Weak password"
      });
    }
    logger.info("beofre find user ")
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Register failed"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};