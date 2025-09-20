const express = require("express");
const router = express.Router();
const { getMessages, postMessage } = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

// GET last 50 messages (protected)
router.get("/", authMiddleware, getMessages);

// POST a new message (protected, optional for Postman/testing)
router.post("/", authMiddleware, postMessage);

module.exports = router;