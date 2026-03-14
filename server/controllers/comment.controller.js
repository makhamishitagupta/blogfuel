import Comment from "../models/comment.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getBlogComments = catchAsync(async (req, res, next) => {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: "ok",
        comments
    });
});

export const createComment = catchAsync(async (req, res, next) => {
    const { blogId } = req.params;
    const { text } = req.body;

    if (!text) {
        return next(new AppError("Comment text is required", 400));
    }

    const comment = await Comment.create({
        blog: blogId,
        user: req.user._id,
        text
    });

    res.status(201).json({
        status: "ok",
        message: "Comment added successfully",
        comment
    });
});

export const updateComment = catchAsync(async (req, res, next) => {
    const { blogId, commentId } = req.params;
    const { text } = req.body;

    if (!text) {
        return next(new AppError("Comment text cannot be empty", 400));
    }

    const comment = await Comment.findOne({ _id: commentId, blog: blogId });

    if (!comment) {
        return next(new AppError("Comment not found", 404));
    }

    if (!comment.user.equals(req.user._id) && req.user.role !== 'admin') {
        return next(new AppError("Not allowed to update this comment", 403));
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({
        status: "ok",
        message: "Comment updated successfully",
        comment
    });
});

export const deleteComment = catchAsync(async (req, res, next) => {
    const { blogId, commentId } = req.params;

    const comment = await Comment.findOne({ _id: commentId, blog: blogId });

    if (!comment) {
        return next(new AppError("Comment not found", 404));
    }

    if (!comment.user.equals(req.user._id) && req.user.role !== 'admin') {
        return next(new AppError("Not allowed to delete this comment", 403));
    }

    await comment.deleteOne();

    res.status(200).json({
        status: "ok",
        message: "Comment deleted successfully"
    });
});

export const getAllComments = catchAsync(async (req, res, next) => {
    const comments = await Comment.find()
        .populate("user", "name email")
        .populate("blog", "title isActive")
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: "ok",
        comments
    });
});