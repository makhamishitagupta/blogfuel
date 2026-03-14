import express from "express";
import {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleFavorite,
    getFavoriteBlogs,
    searchBlogs,
    getBlogLikes,
    likeBlog,
    unlikeBlog
} from "../controllers/blog.controller.js";

import {auth, adminOnly} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getAll", getAllBlogs);
router.get("/admin/getAll", auth, adminOnly, getAllBlogs);
router.get("/getById/:id", getBlogById);
router.post("/create", auth, adminOnly, createBlog);
router.put("/update/:id", auth, adminOnly, updateBlog);
router.delete("/delete/:id", auth, adminOnly, deleteBlog);
router.post("/:id/favorite", auth, toggleFavorite);
router.get("/favorites", auth, getFavoriteBlogs);
router.get("/search", searchBlogs);
router.get("/:id/likes", getBlogLikes);
router.post("/:id/like", auth, likeBlog);
router.post("/:id/unlike", auth, unlikeBlog);

export default router;