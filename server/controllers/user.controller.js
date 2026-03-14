import { OAuth2Client } from "google-auth-library";
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/jwt.js";
import Comment from "../models/comment.model.js";
import Blog from "../models/blog.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Helper to generate and save a session token for a user
 */
const createAndSendToken = (user, res, statusCode, message) => {
    const token = generateToken(user._id);

    res.status(statusCode).json({
        status: "ok",
        message,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            picture: user.picture,
            favorites: user.favorites || []
        }
    });
};

export const googleLogin = catchAsync(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return next(new AppError("Google token is required", 400));
    }

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;
    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        user = await User.create({
            name,
            email: normalizedEmail,
            password: "", // no password for google-only users
            role: "user",
            picture
        });
    }

    await createAndSendToken(user, res, 200, "Google login successful");
});

export const registerUser = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new AppError("All fields are required", 400));
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        return next(new AppError("A user with this email already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword
    });

    res.status(201).json({
        status: "ok",
        message: "User registered successfully"
    });
});

export const loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Email and password are required", 400));
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password || ""))) {
        return next(new AppError("Invalid credentials", 401));
    }

    if (!user.password || user.password === "") {
         return next(new AppError("This account was created via Google. Please use 'Continue with Google' to log in.", 401));
    }

    await createAndSendToken(user, res, 200, "Login successful");
});

export const logoutUser = catchAsync(async (req, res, next) => {
    // JWT is stateless, so we just clear it on the frontend.
    // However, we return success to stay consistent.
    res.status(200).json({
        status: "ok",
        message: "Logout successful"
    });
});

export const addToHistory = catchAsync(async (req, res, next) => {
    const { blogId } = req.body;
    const userId = req.user._id;

    if (!blogId) {
        return next(new AppError("Blog ID is required", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    user.readingHistory = user.readingHistory.filter(item => 
        item.blog && item.blog.toString() !== blogId
    );

    user.readingHistory.unshift({ blog: blogId, viewedAt: new Date() });

    if (user.readingHistory.length > 20) {
        user.readingHistory = user.readingHistory.slice(0, 20);
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({ status: "ok", message: "History updated" });
});

export const getHistory = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
        path: 'readingHistory.blog',
        match: { isActive: true },
        populate: {
            path: 'author',
            select: 'name'
        }
    });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const history = user.readingHistory
        .filter(item => item.blog !== null)
        .map(item => {
            const blog = item.blog.toObject();
            return {
                ...blog,
                id: blog._id,
                viewedAt: item.viewedAt
            };
        });

    res.status(200).json({ status: "ok", history });
});

export const getUserActivity = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const [user, commentCount] = await Promise.all([
        User.findById(userId),
        Comment.countDocuments({ user: userId })
    ]);

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        status: "ok",
        activity: {
            blogsRead: user.readingHistory.length,
            blogsSaved: user.favorites.length,
            commentsMade: commentCount
        }
    });
});
export const getProfile = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: "ok",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            picture: req.user.picture,
            favorites: req.user.favorites || []
        },
    });
});
export const getMyComments = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const comments = await Comment.find({ user: userId })
        .populate({
            path: 'blog',
            match: { isActive: true },
            select: 'title'
        })
        .sort({ createdAt: -1 });

    // Filter out comments where the blog is null (inactive or deleted)
    const activeComments = comments.filter(c => c.blog !== null);

    res.status(200).json({
        status: "ok",
        comments: activeComments
    });
});

export const updateProfile = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    const user = req.user;

    if (name) user.name = name;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: "ok",
        message: "Profile updated successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            picture: user.picture,
            favorites: user.favorites || []
        }
    });
});

export const deleteProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
        status: "ok",
        message: "Profile deleted successfully"
    });
});

export const createAdmin = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new AppError("All fields are required", 400));
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        return next(new AppError("Email already in use", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "admin"
    });

    res.status(201).json({
        status: "ok",
        message: "Admin created successfully"
    });
});

export const getAdminStats = catchAsync(async (req, res, next) => {
    const [totalUsers, totalActiveBlogs, totalInactiveBlogs, totalComments, activeBlogsWithLikes] = await Promise.all([
        User.countDocuments(),
        Blog.countDocuments({ isActive: true }),
        Blog.countDocuments({ isActive: false }),
        Comment.countDocuments(),
        Blog.find({ isActive: true }).select('likes')
    ]);

    const totalLikes = activeBlogsWithLikes.reduce((acc, b) => acc + (b.likes ? b.likes.length : 0), 0);

    const recentBlogs = await Blog.find({ isActive: true })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .limit(5);
    
    const blogsWithComments = await Promise.all(recentBlogs.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blog: blog._id });
        return {
            ...blog.toObject(),
            id: blog._id,
            commentsCount: commentCount
        };
    }));

    res.status(200).json({
        status: "ok",
        stats: {
            totalUsers,
            totalBlogs: totalActiveBlogs,
            inactiveBlogs: totalInactiveBlogs,
            totalComments,
            totalLikes
        },
        recentBlogs: blogsWithComments
    });
});

export const getAdminUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
        status: "ok",
        users
    });
});