import Announcement from "../models/announcement.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createAnnouncement = catchAsync(async (req, res, next) => {
  const { title, content, important } = req.body;

  if (!title || !content) {
    return next(new AppError("Title and content are required", 400));
  }

  const announcement = await Announcement.create({
    title,
    content,
    important
  });

  res.status(201).json({
    status: "ok",
    message: "Announcement created successfully",
    announcement
  });
});

export const getAllAnnouncements = catchAsync(async (req, res, next) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "ok",
    announcements
  });
});

export const updateAnnouncement = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let announcement = await Announcement.findById(id);
  if (!announcement) {
    return next(new AppError("Announcement not found", 404));
  }

  announcement = await Announcement.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "ok",
    message: "Announcement updated successfully",
    announcement
  });
});

export const deleteAnnouncement = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const announcement = await Announcement.findById(id);
  if (!announcement) {
    return next(new AppError("Announcement not found", 404));
  }

  await announcement.deleteOne();

  res.status(200).json({
    status: "ok",
    message: "Announcement deleted successfully"
  });
});
