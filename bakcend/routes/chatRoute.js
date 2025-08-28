import express from "express";
import Chat from "../models/chatModel.js"

const router = express.Router();

router.post("/start", async (req, res, next) => {
  try {
    const { userId, agentId } = req.body;

    let chat = await Chat.findOne({ users: { $all: [userId, agentId] } });

    if (!chat) {
      chat = await Chat.create({ users: [userId, agentId], messages: [] });
    }

    res.json(chat);
  } catch (err) {
    next(err);
  }
});

router.post("/send", async (req, res, next) => {
  try {
    const { chatId, sender, text } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    chat.message.push({ sender, text });
    await chat.save();

    res.json(chat);
  } catch (err) {
    next(err);
  }
});

router.get("/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const chats = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

export default router;
