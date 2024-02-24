const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../conf/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, cPassword, pic } = req.body;
  if (!name || !email || !password || !cPassword) {
    res.status(400);
    throw new Error("Please Enter all the feilds");
  }

  if (password !== cPassword) {
    res.status(400);
    throw new Error("Both the password are not matching");
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error("User exists");
  }

  const newUser = await new User({
    name: name,
    email: email,
    password: password,
    pic: pic,
  });

  await newUser.save();
  if (newUser) {
    console.log("New User Created Succusfully");
    return res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
      password: newUser.password,
      token: generateToken(newUser._id),
    });
  }

  res.status(400);
  throw new Error("Fail to create user");
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid ID");
  }
});

// /api/user
const allUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // console.log(users);
  res.json(users);
});

// const deleteUserFromModelsPlz = async (req, res) => {
//   try {
//     const result = await User.deleteMany({});
//     console.log(`Deleted ${result.deletedCount} entries.`);
//   } catch (error) {
//     console.error("Error deleting entries:", error);
//   }
// };

module.exports = { registerUser, authUser, allUser };
