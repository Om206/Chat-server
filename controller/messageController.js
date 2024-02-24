const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed info request");
    res.sendStatus(400);
    throw new Error("Please fill all the data");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  // console.log(newMessage);

  try {
    var message = await Message.create(newMessage);
    // console.log("message1 " + message);
    message = await Message.populate(message, {
      path: "sender",
      select: "name pic",
    });
    // console.log("message2 " + message);
    message = await Message.populate(message, {
      path: "chat",
    });
    // console.log("message3 " + message);
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
