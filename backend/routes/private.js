const express = require('express');
const router = express.Router();
const {protect,protectAdmin} = require('../middleware/auth')
const {anunturi} = require('../controllers/anunturi')
const {registerAdmin} = require('../controllers/auth')
const {createCheckoutSession} = require('../stripe/checkout')
const {vanzariAdauga,vanzariAbonament,vanzari,vanzariCerereValidare,vanzariUtilizator,vanzariAnuleaza,vanzariReinoire} = require('../controllers/vanzare')
const {webhook} = require('../stripe/webhook')
const {cancelPayment} = require('../stripe/cancel')
const {validari,validariAdauga,validariUtilizator,validariAnuleaza} = require('../controllers/validari')

router.route("/registerAdmin").post(protectAdmin,registerAdmin);
router.route('/anunturiProtejate').get(protectAdmin,anunturi);
router.route('/checkout').post(protect,createCheckoutSession);
router.route('/webhook').post(webhook);
router.route('/vanzariAdauga').post(vanzariAdauga);
router.route('/vanzari').get(protect,vanzari);
router.route('/vanzariAbonament/:user').get(protect,vanzariAbonament);
router.route('/vanzariUtilizator/:user').get(protect,vanzariUtilizator);
router.route('/vanzariAnuleaza/:id').post(vanzariAnuleaza);
router.route('/vanzariReinoire/:id').post(vanzariReinoire);
router.route('/vanzariCerereValidare/:id').post(vanzariCerereValidare);
router.route('/cancelPayment').post(protect,cancelPayment);
router.route('/validariUtilizator/:user').get(protect,validariUtilizator);
router.route('/validariAdauga').post(protect,validariAdauga);
router.route('/validari').get(protect,validari);
router.route('/validariAnuleaza/:id').post(validariAnuleaza);

module.exports = router;