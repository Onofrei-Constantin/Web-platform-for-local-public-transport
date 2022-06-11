const express = require('express');
const router = express.Router();
const {login,register,registerAdmin,refresh,logout} = require('../controllers/auth')
const {protectAdmin} = require('../middleware/auth')

router.route("/refresh").post(refresh);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/registerAdmin").post(protectAdmin,registerAdmin);
router.route("/logout").post(logout);

module.exports = router;