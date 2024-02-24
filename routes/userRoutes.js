const express = require("express");
const router = express.Router();
const { protect } = require("../middlerware/authMiddleware");
const {
  registerUser,
  authUser,
  allUser,
} = require("../controller/userController");

router.route("/").post(registerUser).get(protect, allUser);

router.post("/login", authUser);

module.exports = router;
