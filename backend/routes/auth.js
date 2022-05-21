const express = require('express');
const router = express.Router();
const {protect,protectAdmin} = require('../middleware/auth')
const {login,register,registerAdmin,refresh,logout} = require('../controllers/auth')

router.route("/refresh").post(refresh);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/registerAdmin").post(registerAdmin);
router.route("/logout").post(protect,logout);

module.exports = router;