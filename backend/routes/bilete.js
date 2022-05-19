const router = require('express').Router();
const { default: userEvent } = require('@testing-library/user-event');
let Bilet = require('../models/bilete.model');

router.route('/').get((req,res) =>{
    Bilet.find().sort({"tip":"-1"})
        .then(bilete => res.json(bilete))
        .catch(err=> res.status(400).json('Error: '+ err));
});

router.route('/add').post((req,res)=>{
    const tip = req.body.tip;
    const numeBilet = req.body.numeBilet;
    const pret = Number(req.body.pret);
    const valabilitate = req.body.valabilitate;
    
    const newBilet = new Bilet({tip,numeBilet,pret,valabilitate});

    newBilet.save()
        .then(()=>res.json('Bilet adaugat!'))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').get((req,res)=>{
    Bilet.findById(req.params.id)
        .then(()=>res.json('Bilet sters!'))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').delete((req,res)=>{
    Bilet.findByIdAndDelete(req.params.id)
        .then(bilete=>res.json(bilete))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/update/:id').post((req,res)=>{
    Bilet.findById(req.params.id)
        .then(bilete=>{
            bilete.tip = req.body.tip;
            bilete.numeBilet = req.body.numeBilet;
            bilete.pret = Number(req.body.pret);
            bilete.valabilitate = req.body.valabilitate;

            bilete.save()
                .then(()=>res.json('Bilet actualizat!'))
                .catch(err => res.status(400).json('Error: '+err));
        })
        .catch(err => res.status(400).json('Error: '+err));
});

module.exports = router;