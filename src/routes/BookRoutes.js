import express from "express";
import Book from "../models/book.js";
import v2 from "../lib/cloudinary.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", ProtectRoute, async (req, res) => {

    try {
        const { title, desc, image , rating } = req.body;

        if (!title || !desc || !image){
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const uploadResult = await v2.uploader.upload(image);
        const imageUrl = uploadResult.secure_url;

        const book = new Book({
            user: req.user._id,
            title,
            desc,
            image: imageUrl,
            rating
        });
        await book.save();
        res.status(201).json({
            message: "Book added successfully",
            book
        });

    } catch (error) {
        console.log("error adding book: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }

});

router.get("/", ProtectRoute, async (req, res) => {

    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        const total = await Book.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const books = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "username profileImage");
        if (!books) {
            return res.status(404).json({ message: "No books found" });
        }
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        res.send({
            books,
            totalPages,
            currentPage: page,
            totalBooks: total,
        });

    } catch (error) {
        console.log("error getting books: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/user", ProtectRoute, async (req, res) => {

    try {
        const book = await Book.find({ user: req.user._id });
        if (!book) {
            return res.status(404).json({ message: "No books found" });
        }
        if (book.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        res.json(book);

    } catch (error) {
        console.log("error getting user books: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }

});

router.delete("/:id", ProtectRoute, async (req, res) => {
    try {

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await v2.uploader.destroy(publicId);
            } catch (error) {
                console.log("error deleting image: ", error);
            }
        }

        await book.deleteOne();
        res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
        console.log("error deleting book: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


export default router; 