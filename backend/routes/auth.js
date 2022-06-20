const express = require('express');
const router = express.Router();
const {login,register,refresh,logout,gasireUtilizator} = require('../controllers/auth')
const {protectAngajat} = require('../middleware/auth')

router.route("/refresh").post(refresh);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").post(logout);
router.route("/gasireUtilizator/:user").get(protectAngajat,gasireUtilizator);

module.exports = router;