let Validari = require('../models/validari.model');

exports.validari = async (req,res) =>{
    await Validari.find()
        .then(validari => res.status(200).json(validari))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.validariUtilizator = async (req,res) =>{
    await Validari.find({'user':req.params.user})
        .then(validari => res.status(200).json(validari))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.validariAdauga = async (req,res)=>{
    const user = req.body.user;
    const idBilet = req.body.idBilet;
    const imagini = req.body.imagini;

    const newValidare = new Validari({user,idBilet,imagini});

    await newValidare.save()
        .then(()=>res.json('Validare adaugata!'))
        .catch(err => res.status(400).json('Error: '+ err));
};


exports.validariAnuleaza = async (req,res)=>{
    await Validari.updateOne({'idBilet':req.params.id},{$set:{'anulat':true}})
        .then(()=>res.json('Validare anulata!'))
        .catch(err => res.status(400).json('Error: '+err));
};