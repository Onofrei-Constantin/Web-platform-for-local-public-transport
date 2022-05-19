const express = require('express');
const router = express.Router();

const {login,register,loginAdministrator,registerAdministrare} = require('../controllers/auth')

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/loginAdministrator").post(loginAdministrator);
router.route("/registerAdministrare").post(registerAdministrare);


module.exports = router;