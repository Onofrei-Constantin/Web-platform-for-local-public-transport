let Statie = require('../models/statii.model');

exports.statii =(req,res) =>{
    Statie.find()
        .then(rute => res.json(rute))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.statiiNume =(req,res) =>{
    Statie.find({'dataRute.marc':true})
        .then(rute => res.json(rute))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.statiiAdauga =(req,res)=>{
    const dataRute = req.body.dataRute;

    const newStatie= new Statie({dataRute});

    newStatie.save()
        .then(()=>res.json('Statie adaugata!'))
        .catch(err => res.status(400).json('Error: '+err));
};