import jwt from "jsonwebtoken";
import User from "../models/user.js";
import "dotenv/config.js";

export const ProtectRoute = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized user not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("error verifying token: ", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}