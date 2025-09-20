const mongoose = require("mongoose");
const { Schema } = mongoose;
const MessageSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Message", MessageSchema);