import express from "express";
import {
    getBlogComments,
    createComment,
    updateComment,
    deleteComment,
    getAllComments
} from "../controllers/comment.controller.js";

import {auth, adminOnly} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/admin/all", auth, adminOnly, getAllComments);
router.get("/:blogId", getBlogComments);
router.post("/:blogId", auth, createComment);
router.put("/:blogId/:commentId", auth, updateComment);
router.delete("/:blogId/:commentId", auth, deleteComment);

export default router;