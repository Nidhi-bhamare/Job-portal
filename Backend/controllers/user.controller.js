import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Register function
export const register = async (req, res) => {
    try {
        const { fullname, email, phonenumber, password, roll } = req.body;

        if (!fullname || !email || !phonenumber || !password || !roll) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({
            fullname,
            email,
            phonenumber,
            password: hashedPassword,
            roll, // Ensure this field is included
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log('Register Error:', error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};


// Login function
export const login = async (req, res) => {
    try {
        const { email, password, roll } = req.body;
        if (!email || !password || !roll) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        if (roll !== user.roll) {
            return res.status(400).json({
                message: "Account doesn't exist with the current role.",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id,
        };

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phonenumber: user.phonenumber,
            roll: user.roll,
            profile: user.profile,
        };

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// Logout function
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// Update Profile function
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phonenumber, bio, skills } = req.body;
        const file = req.file; // Assuming you have file upload handling

        if (!fullname || !email || !phonenumber || !bio || !skills) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        const skillsArray = skills.split(",");
        const userId = req.user.id; // Adjusted to access the authenticated user ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            });
        }

        if (!user.profile) {
            user.profile = {};
        }

        user.fullname = fullname;
        user.email = email;
        user.phonenumber = phonenumber;
        user.profile.bio = bio;
        user.profile.skills = skillsArray;

        await user.save();
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phonenumber: user.phonenumber,
            role: user.role,
            profile: user.profile,
        };
        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};
