const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// POST /api/auth/register → create a new user
router.post("/register", register);

// POST /api/auth/login → authenticate user & return JWT
router.post("/login", login);

module.exports = router;