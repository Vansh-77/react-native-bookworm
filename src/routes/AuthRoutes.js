import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

function generateToken(id) {

    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15d" })

}

router.post("/register", async (req, res) => {

    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingEmail = await User.findOne({ email });
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const profileImage =`https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

        const user = new User({
            username,
            email,
            password,
            profileImage
        });

        await user.save()

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt:user.createdAt,
            },
        })

    } catch (error) {
        console.log("error registering user: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }

});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            }
        })

    } catch (error) {
        console.log("error logging in user: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;