import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;
const JWT_SECRET = process.env.JWT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const MONGODB_URL = process.env.MONGODB_URL;

export const register = async (req, res) => {
  const { name, email, mobile, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      username: username,
      password: hashedPassword,
      default_currency: req.body.default_currency || "INR",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Username Not Found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Wrong Password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(StatusCodes.OK)
      .json({
        token,
        name: user.name,
        username: user.username,
        message: "Login Successfull!!",
      });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error signing in" });
  }
};

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendResetEmail(email, resetCode) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    await transporter.sendMail({
      from: `"NoteNexus" <${EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email could not be sent.");
  }
}

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const hashedCode = await bcrypt.hash(resetCode, 10);

    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendResetEmail(email, resetCode);

    res.json({ message: "Verification code sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Verification code not sent" });
  }
};

export const verifyCode = async (req, res) => {
  const { reset_email, code } = req.body;
  console.log(reset_email);
  console.log(code);
  try {
    const user = await User.findOne({ email: reset_email });
    if (!user || !user.resetPasswordCode)
      return res.status(400).json({ error: "Invalid request" });

    const isMatch = await bcrypt.compare(code, user.resetPasswordCode);
    if (!isMatch || Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    res.json({ message: "Code verified, proceeding to update password" });
  } catch (error) {
    res.status(500).json({ error: "Error verifying code" });
  }
};

export const newPassword = async (req, res) => {
  const { reset_email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: reset_email });
    if (!user) return res.status(400).json({ error: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
  }
};

export const getNotifications = async (req, res) => {
  console.log("Fetching notifications for user:", req.params.username);
  const { username } = req.params;
  try {
    const notifications = await Notification.find({
      recipients: username,
    }).sort({ createdAt: -1 });

    const unseenCount = notifications.filter(
      (n) => !n.seenBy.includes(username)
    ).length;

    res.status(200).json({ notifications, unseenCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

export const resetNotificationCount = async (req, res) => {
  const { username } = req.params;
  try {
    await Notification.updateMany(
      { recipients: username },
      { $addToSet: { seenBy: username } }
    );
    res.status(200).json({ message: "Notification count reset" });
  } catch (error) {
    console.error("Error resetting notifications:", error);
    res.status(500).json({ message: "Failed to reset notifications", error });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { username } = req.params;
  const { name, email, mobile, newusername } = req.body;

  try {
    const user = await User.findOne({ username });

    const oname = user.name;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newusername) {
      const existingUser = await User.findOne({ username: newusername });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (newusername) user.username = newusername;

    const updatedUser = await user.save();

    const updatedName = name || user.name;
    const updatedUsername = newusername || username;

    await Note.updateMany(
      { owner_username: username },
      {
        $set: {
          owner: updatedName,
          owner_username: updatedUsername,
        },
      }
    );

    await Note.updateMany(
      {
        $or: [{ lastEditedBy: oname }, { lastEditedBy: null }],
      },
      {
        $set: {
          lastEditedBy: updatedName,
        },
      }
    );

    return res.status(200).json({
      message: "Profile and related notes updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};
