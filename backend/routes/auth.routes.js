const express = require("express");
const { signup, login, me, updateProfile } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middleware/validate");
const { required, email, minLength } = require("../utils/validation");

const router = express.Router();

router.post("/signup", catchAsync(signup));
router.post("/login", catchAsync(login));
router.get("/me", protect, catchAsync(me));
router.patch("/me", protect, catchAsync(updateProfile));

module.exports = router;
