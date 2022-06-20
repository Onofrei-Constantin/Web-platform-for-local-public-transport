let Vanzare = require('../models/vanzare.model');

exports.vanzari = async (req,res) =>{
    await Vanzare.find({'expirat':false,'anulat':false,'activ':false})
        .then(vanzari => res.status(200).json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.vanzariRestul = async (req,res) =>{
    await Vanzare.find({$or:[{'expirat':true},{'anulat':true},{'activ':true}]})
        .then(vanzari => res.status(200).json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.vanzariUtilizator = async (req,res) =>{
    await Vanzare.find({'user':req.params.user}).sort({"updatedAt":"-1"})
        .then(vanzari => res.status(200).json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.vanzariId = async (req,res) =>{
    await Vanzare.find({'_id':req.params.id}).limit(1)
        .then(vanzari => res.status(200).json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.vanzariCodQr = async (req,res) =>{
    await Vanzare.findOne({'codQrDecodat':req.body.codQrDecodat})
        .then(vanzari => res.status(200).json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};


exports.vanzariAbonament = async (req,res) =>{
    await Vanzare.find({'user':req.body.user,'nominal':"nominal",'expirat':false,'anulat':false}).limit(1)
        .then(vanzari => res.status(200).json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};


exports.vanzariAdauga = async (req,res)=>{
    const idSesiune = req.body.idSesiune;
    const numeBilet = req.body.numeBilet;
    const pret = Number(req.body.pret);
    const dataStart =req.body.dataStart;
    const dataStop = req.body.dataStop;
    const user = req.body.user;
    const nominal = req.body.nominal;
    const expirat = req.body.expirat;
    const activ = req.body.activ;
    const anulat = req.body.anulat;
    const tip = req.body.tip;
    const valabilitateTip = req.body.valabilitateTip;
    const perioada = req.body.perioada;
    const idPayment = req.body.idPayment;
    const tipPersoana= req.body.tipPersoana;
    const cnp = req.body.cnp;
    const idBilet = req.body.idBilet;
    const codQrDecodat = req.body.codQrDecodat;

    const newVanzare = new Vanzare({idSesiune,numeBilet,pret,dataStart,dataStop,user,nominal,expirat,activ,anulat,tip,valabilitateTip,perioada,idPayment,tipPersoana,cnp,idBilet,codQrDecodat});

    await newVanzare.save()
        .then(()=>res.json('Vanzare adaugata!'))
        .catch(err => res.status(400).json('Error: '+ err));
};



exports.vanzariActualizeaza = async (req,res)=>{
    await Vanzare.updateMany({"dataStop" : {$ne : null ,$lt:req.body.data}},{$set:{'expirat':true,'activ':false}})
        .then(()=>res.json('Vanzari actualizate!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.vanzariInVanzareActivare =(req,res) =>{
    Vanzare.updateMany({"idBilet":req.body.idBilet},{$set:{'inVanzare':true}})
        .then(vanzari => res.json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.vanzariInVanzareDezactivare =(req,res) =>{
    Vanzare.updateMany({"idBilet":req.body.idBilet},{$set:{'inVanzare':false}})
        .then(vanzari => res.json(vanzari))
        .catch(err=> res.status(400).json('Error: '+ err));
};


exports.vanzariAnuleaza = async (req,res)=>{
    await Vanzare.findByIdAndUpdate(req.params.id,{$set:{'anulat':true,'activ':false,'expirat':true}})
        .then(()=>res.json('Vanzare anulata!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.vanzariCerereValidare = async (req,res)=>{
    await Vanzare.findByIdAndUpdate(req.params.id,{$set:{'cerereValidare':true}})
        .then(()=>res.json('Cerere validare true!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.vanzariCerereValidareAnuleaza = async (req,res)=>{
    await Vanzare.findByIdAndUpdate(req.params.id,{$set:{'cerereValidare':false}})
        .then(()=>res.json('Cerere validare true!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.vanzariValidare = async (req,res)=>{
    await Vanzare.findByIdAndUpdate(req.body.id,{$set:{'activ':true,'dataStart':req.body.dataStart,'dataStop':req.body.dataStop}})
        .then(()=>res.json('Cerere validare true!'))
        .catch(err => res.status(400).json('Error: '+err));
};


exports.vanzariBiletVerificat = async (req,res)=>{
    await Vanzare.findOneAndUpdate({codQrDecodat:req.body.codQrDecodat},{$set:{'verificat':true,'data_si_ora_cursei':req.body.data_si_ora_cursei,'numarul_mijlocului_de_transport':req.body.numarul_mijlocului_de_transport,'ruta_cursei':req.body.ruta_cursei}})
        .then(()=>res.json('Bilet deja verificat!'))
        .catch(err => res.status(400).json('Error: '+err));
};


