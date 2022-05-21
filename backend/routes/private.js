const express = require('express');
const router = express.Router();
const {protect,protectAdmin} = require('../middleware/auth')
const {anunturi} = require('../controllers/anunturi')
const {registerAdmin} = require('../controllers/auth')

router.route("/registerAdmin").post(protectAdmin,registerAdmin);
router.route('/anunturiProtejate').get(protectAdmin,anunturi);

module.exports = router;