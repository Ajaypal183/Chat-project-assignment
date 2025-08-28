import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import authRouter from "../routes/authRoute.js";
import chatRouter from "../routes/chatRoute.js";
import connectDB from "../database/db.js";
import Chat from "../models/chatModel.js";
import { logger } from "../middlewares/logger.js";
import { errorHandler } from "../middlewares/errorHandler.js";

dotenv.config()

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
app.use(express.json());
app.use(logger)
app.use('/api/auth', authRouter)
app.use('/api/chat',  chatRouter)
app.use(errorHandler)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(" New client connected:", socket.id);

  socket.on("join", ({ role, id }) => {
    socket.join(id); 
    console.log(`${role} joined with ID: ${id}`);
  });

  socket.on("message", async ({ senderId, receiverId, text }) => {
    console.log(`Message from ${senderId} to ${receiverId}: ${text}`);

    const chat = new Chat({
      senderId,
      receiverId,
      message: text,
    });

    await chat.save();
   io.to(receiverId).emit("message", {
      senderId,
      text,
      createdAt: chat.createdAt, 
    });

  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Server running...");
});

server.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
