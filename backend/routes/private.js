const express = require('express');
const router = express.Router();
const {protect,protectAdmin,protectAngajat} = require('../middleware/auth')
const {registerAdmin,registerAngajat} = require('../controllers/auth')
const {createCheckoutSession} = require('../stripe/checkout')
const {vanzariInVanzareDezactivare,vanzariInVanzareActivare,vanzariAdauga,vanzariRestul,vanzariValidare,vanzariCerereValidareAnuleaza,vanzariId,vanzariBiletVerificat,vanzariAbonament,vanzari,vanzariCodQr,vanzariCerereValidare,vanzariUtilizator,vanzariAnuleaza} = require('../controllers/vanzare')
const {webhook} = require('../stripe/webhook')
const {cancelPayment} = require('../stripe/cancel')
const {validari,validariAdauga,validariValideaza,validariAnuleaza} = require('../controllers/validari');
const {anunturiAdauga,anunturiAdmin,anunturiActiveaza,anunturiDezactiveaza,anunturiActualizeaza } = require('../controllers/anunturi');
const {bileteAdauga,bileteActiveaza,bileteDezactiveaza,bileteAdmin,bileteActualizeaza,bileteGaseste} = require('../controllers/bilete');

router.route("/bileteAdmin").get(protectAdmin,bileteAdmin);
router.route("/bileteAdauga").post(protectAdmin,bileteAdauga);
router.route("/bileteGaseste").post(protect,bileteGaseste);
router.route("/bileteActiveaza").post(protectAdmin,bileteActiveaza);
router.route("/bileteDezactiveaza").post(protectAdmin,bileteDezactiveaza);
router.route("/bileteActualizeaza/:id").post(protectAdmin,bileteActualizeaza);

router.route("/anunturiAdmin").get(protectAdmin,anunturiAdmin);
router.route("/anunturiAdauga").post(protectAdmin,anunturiAdauga);
router.route("/anunturiActiveaza").post(protectAdmin,anunturiActiveaza);
router.route("/anunturiDezactiveaza").post(protectAdmin,anunturiDezactiveaza);
router.route("/anunturiActualizeaza/:id").post(protectAdmin,anunturiActualizeaza);

router.route("/registerAdmin").post(protectAdmin,registerAdmin);
router.route("/registerAngajat").post(protectAdmin,registerAngajat);

router.route("/vanzariInVanzareDezactivare").post(protectAdmin,vanzariInVanzareDezactivare);
router.route("/vanzariInVanzareActivare").post(protectAdmin,vanzariInVanzareActivare);
router.route("/vanzariCodQr").post(protectAngajat,vanzariCodQr);
router.route("/vanzariBiletVerificat").post(protectAngajat,vanzariBiletVerificat);
router.route('/checkout').post(protect,createCheckoutSession);
router.route('/webhook').post(webhook);
router.route('/vanzariAdauga').post(vanzariAdauga);
router.route('/vanzari').get(protect,vanzari);
router.route('/vanzariRestul').get(protect,vanzariRestul);
router.route('/vanzariAbonament').post(protect,vanzariAbonament);
router.route('/vanzariId/:id').get(protectAngajat,vanzariId);
router.route('/vanzariUtilizator/:user').get(protect,vanzariUtilizator);
router.route('/vanzariAnuleaza/:id').post(vanzariAnuleaza);
router.route('/vanzariCerereValidare/:id').post(vanzariCerereValidare);
router.route('/vanzariCerereValidareAnuleaza/:id').post(vanzariCerereValidareAnuleaza);
router.route('/vanzariValidare').post(protectAngajat,vanzariValidare);
router.route('/cancelPayment').post(protect,cancelPayment);

router.route('/validariAdauga').post(protect,validariAdauga);
router.route('/validari').get(protectAngajat,validari);
router.route('/validariAnuleaza/:id').post(validariAnuleaza);
router.route('/validariValideaza/:id').post(validariValideaza);

module.exports = router;