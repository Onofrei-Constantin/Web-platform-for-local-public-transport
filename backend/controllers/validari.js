let Validari = require('../models/validari.model');

exports.validari = async (req,res) =>{
    await Validari.find().sort({"createdAt":"-1"})
        .then(validari => res.status(200).json(validari))
        .catch(err=> res.status(400).json('Error: '+ err));
};


exports.validariAdauga = async (req,res)=>{
    const user = req.body.user;
    const idTranzactie = req.body.idTranzactie;
    const imagini = req.body.imagini;

    const newValidare = new Validari({user,idTranzactie,imagini});

    await newValidare.save()
        .then(()=>res.json('Validare adaugata!'))
        .catch(err => res.status(400).json('Error: '+ err));
};


exports.validariAnuleaza = async (req,res)=>{
    await Validari.updateOne({'idTranzactie':req.params.id,'anulat':false},{$set:{'anulat':true}})
        .then(()=>res.json('Validare anulata!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.validariValideaza = async (req,res)=>{
    await Validari.updateOne({'idTranzactie':req.params.id,'anulat':false},{$set:{'validat':true}})
        .then(()=>res.json('Validare anulata!'))
        .catch(err => res.status(400).json('Error: '+err));
};