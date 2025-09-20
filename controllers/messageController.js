const Message = require("../models/Message");

// Fetch last 50 messages
const getMessages = async (req, res) => {
  try {
    let messages = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "username");

    // Reverse so oldest comes first
    messages = messages.reverse();

    const payload = messages.map(m => ({
      id: m._id,
      content: m.content,
      author: m.author?.username,
      createdAt: m.createdAt
    }));

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Post a new message (for Postman/testing)
const postMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Message content required" });

    const msg = await Message.create({
      content,
      author: req.user.id
    });

    await msg.populate("author", "username");

    res.status(201).json({
      id: msg._id,
      content: msg.content,
      author: msg.author?.username,
      createdAt: msg.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMessages, postMessage };