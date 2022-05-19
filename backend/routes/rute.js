const router = require('express').Router();
const { default: userEvent } = require('@testing-library/user-event');
let Ruta = require('../models/rute.model');

router.route('/').get((req,res) =>{
    Ruta.find()
        .then(rute => res.json(rute))
        .catch(err=> res.status(400).json('Error: '+ err));
});

router.route('/add').post((req,res)=>{
    const denumire = req.body.denumire;
    const numeStatii = req.body.numeStatii;

    
    const newRuta = new Ruta({denumire,numeStatii});

    newRuta.save()
        .then(()=>res.json('Ruta adaugata!'))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').get((req,res)=>{
    Ruta.findById(req.params.id)
        .then(()=>res.json('Ruta stearsa!'))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').delete((req,res)=>{
    Ruta.findByIdAndDelete(req.params.id)
        .then(rute=>res.json(rute))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/update/:id').post((req,res)=>{
    Ruta.findById(req.params.id)
        .then(rute=>{
            rute.denumire = req.body.denumire;
            rute.numeStatii = Array(req.body.numeStatii);

            rute.save()
                .then(()=>res.json('Ruta actualizata!'))
                .catch(err => res.status(400).json('Error: '+err));
        })
        .catch(err => res.status(400).json('Error: '+err));
});

module.exports = router;