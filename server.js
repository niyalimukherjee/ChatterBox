require("dotenv").config();
const http = require("http");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.js");
const messageRoutes = require("./routes/messages.js");


const app = express();
const server = http.createServer(app);



connectDB(process.env.MONGO_URI);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));



const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
