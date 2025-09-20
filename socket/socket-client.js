const axios = require("axios");
const { io } = require("socket.io-client");

// Replace with your login credentials
const LOGIN_URL = "http://localhost:4000/api/auth/login";
const USERNAME = "alice";
const PASSWORD = "password123";

async function start() {
  try {
    // 1️⃣ Login and get JWT token
    const loginRes = await axios.post(LOGIN_URL, {
      username: USERNAME,
      password: PASSWORD,
    });

    const token = loginRes.data.token;
    console.log("Fetched JWT Token:", token);

    // 2️⃣ Connect to Socket.IO server
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      // Authenticate socket with token
      socket.emit("authenticate", token);
    });

    socket.on("authenticated", (data) => {
      console.log("Authenticated as:", data.username);

      // Example: send a message
      socket.emit("sendMessage", "Hello everyone!");
    });

    // Receive messages from others
    socket.on("newMessage", (msg) => {
      console.log("New message from others:", msg);
    });

    // Confirmation for your own message
    socket.on("messageSent", (msg) => {
      console.log("Your message was sent:", msg);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
  }
}

start();