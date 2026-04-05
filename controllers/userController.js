import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email");

    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });
  }
};