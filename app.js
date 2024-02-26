const express = require("express");
const app = express();
const http = require("http");
const chats = require("./data/data");
const connectDB = require("./db/conn");
const userRouter = require("./routes/userRoutes");
const chatsRoute = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoute");
const { errorHandler, notFound } = require("./middlerware/errorMiddlerware");
require("dotenv").config();
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow the specified HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow the specified headers
  next();
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "https://chat-application-five-eta.vercel.app"],
  },
});

const PORT = process.env.PORT;
const url = process.env.DATABASE;
const path = require("path");

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/chat", chatsRoute);
app.use("/api/message", messageRoute);

// ------------- Deployment------------

const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   const rootPath = path.resolve(__dirname, "..");
//   app.use(express.static(path.join(rootPath, "/frontend/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(rootPath, "frontend", "build", "index.html"));
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running");
//   });
// }
// ------------- Deployment------------

app.get("/", (req, res) => {
    res.send("API is running");
  });
app.use(notFound);
app.use(errorHandler);
const start = async () => {
  try {
    await connectDB(url);
  } catch (error) {
    console.log(error);
  }
};

start();

server.listen(PORT, console.log(`Server is listening at port: ${PORT}`));

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecived) => {
    var chat = newMessageRecived.chat;

    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageRecived.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecived);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
