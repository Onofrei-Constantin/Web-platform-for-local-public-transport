const express = require('express');
const router = express.Router();

const {statii,statiiAdauga} = require('../controllers/statii')
const {anunturi,anunturiHome,anunturiGaseste} = require('../controllers/anunturi')
const {bilete,bileteAdauga} = require('../controllers/bilete')
const {rute} = require('../controllers/rute')
const {resetTokenList,addResetTokenList,deleteResetTokenList} = require('../controllers/resetTokenList')
const {vanzariActualizeaza} = require('../controllers/vanzare')

router.route("/anunturi").get(anunturi);
router.route("/statii").get(statii);
router.route("/statiiAdauga").post(statiiAdauga);
router.route("/anunturiHome").get(anunturiHome);
router.route("/anunturiGaseste/:id").get(anunturiGaseste);
router.route("/bilete").get(bilete);
router.route("/bileteAdauga").post(bileteAdauga);
router.route("/rute").get(rute);
router.route('/resetTokenList').post(resetTokenList);
router.route('/addResetTokenList').post(addResetTokenList);
router.route('/deleteResetTokenList/:id').post(deleteResetTokenList);
router.route('/vanzariActualizeaza').post(vanzariActualizeaza);

module.exports = router;