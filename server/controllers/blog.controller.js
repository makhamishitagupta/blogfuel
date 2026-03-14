import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllBlogs = catchAsync(async (req, res, next) => {
  const { tag } = req.query;
  
  // Default filter for public view
  let filter = { isActive: true };

  // If user is admin, show all blogs (active + inactive) for management purposes
  // Note: auth middleware might not be present on the public 'getAll' route, 
  // so we check if req.user exists and has admin role.
  if (req.user && req.user.role === 'admin') {
    filter = {};
  }

  if (tag) {
    filter.tags = tag.toLowerCase();
  }

  const blogs = await Blog.find(filter)
    .populate("author", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "ok",
    count: blogs.length,
    blogs
  });
});

export const getBlogById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id)
    .populate("author", "name email")
    .populate("likes", "name email");

  if (!blog || !blog.isActive) {
    return next(new AppError("Blog not found", 404));
  }

  res.status(200).json({
    status: "ok",
    blog
  });
});

export const createBlog = catchAsync(async (req, res, next) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return next(new AppError("Title and content are required", 400));
  }

  const blog = await Blog.create({
    title: title.trim(),
    content: content.trim(),
    author: req.user._id,
    tags: Array.isArray(tags) ? tags : []
  });

  res.status(201).json({
    status: "ok",
    message: "Blog created successfully",
    blog
  });
});

export const updateBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;

  const blog = await Blog.findById(id);

  if (!blog || !blog.isActive) {
    return next(new AppError("Blog not found", 404));
  }

  // Check if user is author or admin
  if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError("You do not have permission to update this blog", 403));
  }

  if (title) blog.title = title.trim();
  if (content) blog.content = content.trim();
  if (tags) blog.tags = Array.isArray(tags) ? tags : blog.tags;

  await blog.save();

  res.status(200).json({
    status: "ok",
    message: "Blog updated successfully",
    blog
  });
});

export const deleteBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog || !blog.isActive) {
    return next(new AppError("Blog not found", 404));
  }

  // Check permission
  if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError("You do not have permission to delete this blog", 403));
  }

  blog.isActive = false;
  await blog.save();

  res.status(200).json({
    status: "ok",
    message: "Blog deleted successfully"
  });
});

export const likeBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog || !blog.isActive) {
    return next(new AppError("Blog not found", 404));
  }

  if (blog.likes.includes(req.user._id)) {
    return next(new AppError("You already liked this blog", 400));
  }

  blog.likes.push(req.user._id);
  await blog.save();

  res.status(200).json({
    status: "ok",
    message: "Blog liked",
    totalLikes: blog.likes.length
  });
});

export const unlikeBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog || !blog.isActive) {
    return next(new AppError("Blog not found", 404));
  }

  blog.likes = blog.likes.filter(
    userId => userId.toString() !== req.user._id.toString()
  );

  await blog.save();

  res.status(200).json({
    status: "ok",
    message: "Blog unliked",
    totalLikes: blog.likes.length
  });
});

export const getBlogLikes = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id).populate("likes", "name email");

  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  res.status(200).json({
    status: "ok",
    totalLikes: blog.likes.length,
    users: blog.likes
  });
});

export const toggleFavorite = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const exists = user.favorites.includes(id);

  if (exists) {
    user.favorites = user.favorites.filter(blogId => blogId.toString() !== id);
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: "ok",
      message: "Removed from favorites"
    });
  }

  user.favorites.push(id);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "ok",
    message: "Added to favorites"
  });
});

export const getFavoriteBlogs = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: "favorites",
    match: { isActive: true }
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Mongoose populate with 'match' will set unmatched items to null if they were there,
  // or just omit them if they didn't match the query. 
  // We filter out nulls just in case.
  const activeFavorites = user.favorites.filter(blog => blog !== null);

  res.status(200).json({
    status: "ok",
    count: activeFavorites.length,
    blogs: activeFavorites
  });
});

export const searchBlogs = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new AppError("Search query required", 400));
  }

  const blogs = await Blog.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  }).populate('author', 'name');

  res.status(200).json({
    status: "ok",
    count: blogs.length,
    blogs
  });
});