let Vanzare = require('../models/vanzare.model');

exports.vanzari = async (req,res) =>{
    await Vanzare.find()
        .then(vanzari => res.status(200).json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.vanzariUtilizator = async (req,res) =>{
    await Vanzare.find({'user':req.params.user})
        .then(vanzari => res.status(200).json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};


exports.vanzariAbonament = async (req,res) =>{
    await Vanzare.find({'user':req.params.user,'tip':"nominal",'expirat':false,'anulat':false}).limit(1)
        .then(vanzari => res.status(200).json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};


exports.vanzariAdauga = async (req,res)=>{
    const idTranzactie = req.body.idTranzactie;
    const numeBilet = req.body.numeBilet;
    const pret = Number(req.body.pret);
    const dataStart =req.body.dataStart;
    const dataStop = req.body.dataStop;
    const codQR = req.body.codQR;
    const user = req.body.user;
    const tip = req.body.tip;
    const expirat = req.body.expirat;
    const activ = req.body.activ;
    const anulat = req.body.anulat;
    const tipImagine = req.body.tipImagine;
    const valabilitateTip = req.body.valabilitateTip;
    const perioada = req.body.perioada;
    const idPayment = req.body.idPayment;
    const tipBilet= req.body.tipBilet;
    const cnp= req.body.cnp;

    const newVanzare = new Vanzare({idTranzactie,numeBilet,pret,dataStart,dataStop,codQR,user,tip,expirat,activ,anulat,tipImagine,valabilitateTip,perioada,idPayment,tipBilet,cnp});

    await newVanzare.save()
        .then(()=>res.json('Vanzare adaugata!'))
        .catch(err => res.status(400).json('Error: '+ err));
};

exports.vanzariActualizeaza = async (req,res)=>{
    await Vanzare.updateMany({"dataStop" : {$ne : null ,$lt:req.body.data}},{$set:{'expirat':true}})
        .then(()=>res.json('Vanzari actualizate!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.vanzariAnuleaza = async (req,res)=>{
    await Vanzare.findByIdAndUpdate(req.params.id,{$set:{'anulat':true,'activ':false,'cerereValidare':false}})
        .then(()=>res.json('Vanzare anulata!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.vanzariReinoire = async (req,res)=>{
    await Vanzare.findByIdAndUpdate(req.params.id,{$set:{'idTranzactie':req.body.idTranzactie,'idPayment':req.body.idPayment,'dataStart':req.body.dataStart,'dataStop':req.body.dataStop,'expirat':false}})
        .then(()=>res.json('Vanzare reinoita!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.vanzariCerereValidare = async (req,res)=>{
    await Vanzare.findByIdAndUpdate(req.params.id,{$set:{'cerereValidare':true}})
        .then(()=>res.json('Cerere validare true!'))
        .catch(err => res.status(400).json('Error: '+err));
};