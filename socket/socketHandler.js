const jwt = require("jsonwebtoken");
const Message = require("./models/Message");
const User = require("./models/User");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    socket.authenticated = false; // Track authentication
    socket.user = null;

    // Listen for authenticate event
    socket.on("authenticate", async (token) => {
      try {
        if (!token) throw new Error("No token provided");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) throw new Error("User not found");

        socket.authenticated = true;
        socket.user = user;
        socket.join("general-chat"); // Default chat room

        socket.emit("authenticated", { username: user.username });
        console.log(`Socket ${socket.id} authenticated as ${user.username}`);
      } catch (err) {
        console.error("Authentication failed:", err.message);
        socket.emit("error", { message: "Authentication failed" });
        socket.disconnect();
      }
    });

    // Listen for sendMessage event
    socket.on("sendMessage", async (content) => {
      try {
        if (!socket.authenticated) throw new Error("Not authenticated");
        if (!content || content.trim() === "") return;

        const msg = await Message.create({
          content,
          author: socket.user._id,
        });

        await msg.populate("author", "username");

        // Emit to all clients in the room
        io.to("general-chat").emit("newMessage", {
          id: msg._id,
          content: msg.content,
          author: msg.author.username,
          createdAt: msg.createdAt,
        });

        // Confirmation to sender
        socket.emit("messageSent", {
          id: msg._id,
          content: msg.content,
          author: msg.author.username,
          createdAt: msg.createdAt,
        });
      } catch (err) {
        console.error("Error sending message:", err.message);
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};