const router = require('express').Router();
let Ruta = require('../models/rute.model');

exports.rute =(req,res) =>{
    Ruta.find()
        .then(rute => res.json(rute))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.ruteAdauga =(req,res)=>{
    const denumire = req.body.denumire;
    const numeStatii = req.body.numeStatii;

    
    const newRuta = new Ruta({denumire,numeStatii});

    newRuta.save()
        .then(()=>res.json('Ruta adaugata!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.ruteGaseste =(req,res)=>{
    Ruta.findById(req.params.id)
        .then(anunturi=>res.json(anunturi))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.ruteSterge = (req,res)=>{
    Ruta.findByIdAndDelete(req.params.id)
        .then(()=>res.json('Ruta stearsa!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.rutaActualizeaza =(req,res)=>{
    Ruta.findById(req.params.id)
        .then(rute=>{
            rute.denumire = req.body.denumire;
            rute.numeStatii = Array(req.body.numeStatii);

            rute.save()
                .then(()=>res.json('Ruta actualizata!'))
                .catch(err => res.status(400).json('Error: '+err));
        })
        .catch(err => res.status(400).json('Error: '+err));
};
