const router = require('express').Router();
const { default: userEvent } = require('@testing-library/user-event');
let Anunt = require('../models/anunturi.model');

router.route('/').get((req,res) =>{

    Anunt.find({"activ":"true"})
        .then(anunturi => res.json(anunturi))
        .catch(err=> res.status(400).json('Error: '+ err));
});

router.route('/home').get((req,res) =>{

    Anunt.find({"activ":"true"}).sort({"updatedAt":"-1"}).limit(3)
        .then(anunturi => res.json(anunturi))
        .catch(err=> res.status(400).json('Error: '+ err));
});

router.route('/add').post((req,res)=>{
    const titlu = req.body.titlu;
    const tip = req.body.tip;
    const text = req.body.text;
    const activ = Boolean(req.body.activ);
    const imagine = req.body.imagine;
    
    const newAnunt = new Anunt({titlu,tip,text,activ,imagine});

    newAnunt.save()
        .then(()=>res.json('Anunt adaugat!'))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/:id').get((req,res)=>{
    Anunt.findById(req.params.id)
        .then(anunturi=>res.json(anunturi))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').delete((req,res)=>{
    Anunt.findByIdAndDelete(req.params.id)
        .then(()=>res.json('Anunt sters!'))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/update/:id').post((req,res)=>{
    Anunt.findById(req.params.id)
        .then(anunturi=>{
            anunturi.titlu = req.body.titlu;
            anunturi.tip = req.body.tip;
            anunturi.text = req.body.text;
            anunturi.activ = Boolean(req.body.activ);
            anunturi.imagine = req.body.imagine;

            anunturi.save()
                .then(()=>res.json('Anunt actualizat!'))
                .catch(err => res.status(400).json('Error: '+err));
        })
        .catch(err => res.status(400).json('Error: '+err));
});

module.exports = router;