// import { Router } from "express";
// import { registerUser, loginUser, logoutUser, updateProfile, getProfile, createAdmin, deleteProfile } from "../controllers/user.controller.js";
// import { auth, adminOnly } from "../middleware/auth.middleware.js";

// const router = Router();

// router.route('/register').post(registerUser);
// router.route('/login').post(loginUser);
// router.route('/logout').post(logoutUser);
// router.route('/update-profile').post(updateProfile);
// router.route('/delete-profile').delete(deleteProfile);
// router.get("/me", auth, getProfile);
// router.route('/admin/create').post(auth, adminOnly, createAdmin);

// export default router;

import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    updateProfile,
    getProfile,
    createAdmin,
    deleteProfile,
    googleLogin,
    addToHistory,
    getHistory,
    getUserActivity,
    getAdminStats,
    getAdminUsers,
    getMyComments
} from "../controllers/user.controller.js";

import { auth, adminOnly } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);

router.post("/history", auth, addToHistory);
router.get("/history", auth, getHistory);
router.get("/activity", auth, getUserActivity);
router.get("/my-comments", auth, getMyComments);

router.post("/logout", logoutUser);
router.post("/update-profile", updateProfile);
router.delete("/delete-profile", deleteProfile);

router.get("/me", auth, getProfile);

router.post("/admin/create", auth, adminOnly, createAdmin);
router.get("/admin/stats", auth, adminOnly, getAdminStats);
router.get("/admin/users", auth, adminOnly, getAdminUsers);

export default router;