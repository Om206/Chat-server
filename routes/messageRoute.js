const express = require("express");
const { protect } = require("../middlerware/authMiddleware");
const router = express.Router();
const { sendMessage, allMessages } = require("../controller/messageController");

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
