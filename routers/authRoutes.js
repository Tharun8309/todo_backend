const express = require("express");
const router = express.Router();
const { Signup, Login, verifyToken } = require("../controllers/authController");


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/verify", verifyToken);


module.exports = router;