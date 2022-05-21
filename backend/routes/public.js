const express = require('express');
const router = express.Router();

const {statii,statiiAdauga} = require('../controllers/statii')
const {anunturi,anunturiHome,anunturiGaseste} = require('../controllers/anunturi')
const {bilete} = require('../controllers/bilete')
const {rute} = require('../controllers/rute')

router.route("/anunturi").get(anunturi);
router.route("/statii").get(statii);
router.route("/statiiAdauga").post(statiiAdauga);
router.route("/anunturiHome").get(anunturiHome);
router.route("/anunturiGaseste/:id").get(anunturiGaseste);
router.route("/bilete").get(bilete);
router.route("/rute").get(rute);

module.exports = router;