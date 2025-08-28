import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  const { role, id } = req.body;
  if (!role || !id) {
    return res.status(400).json({ error: "Role and ID required" });
  }

  if (role === "user") {
    return res.json({ success: true, message: "User logged in", userId: id });
  }
  if (role === "agent") {
    return res.json({ success: true, message: "Agent logged in", agentId: id });
  }

  return res.status(400).json({ error: "Invalid role" });
});

export default router;
