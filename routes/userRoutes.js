const express = require("express");
const {
  Signup,
  Login,
  Check,
Update
} = require("../controller/userController");

const router = express.Router();
//route for signup
router.post("/register", Signup);
//route for login
router.post("/login", Login);
//route to check email and phone number
router.post('/forgotPassword',Check)
//route to update password
router.post('/updatePassword',Update)
module.exports = router;
