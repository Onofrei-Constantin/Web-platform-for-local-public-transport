const router = require('express').Router();
const { default: userEvent } = require('@testing-library/user-event');
let User = require('../models/user.model');

router.route('/').get((req,res) =>{
    User.find()
        .then(user => res.json(user))
        .catch(err=> res.status(400).json('Error: '+ err));
});

router.route('/add').post((req,res)=>{
    const email = req.body.email;
    const parola = req.body.parola;
    const nume = req.body.nume;
    const prenume = req.body.prenume;
    const telefon = Number(req.body.telefon);
    const adresa = req.body.adresa;
    const pozitie = Number(req.body.pozitie);

    const newUser = new User({email,parola,nume,prenume,telefon,adresa,pozitie});

    newUser.save()
        .then(()=>res.json('User added!'))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').get((req,res)=>{
    User.findById(req.params.id)
        .then(user=>res.json(user))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').delete((req,res)=>{
    User.findByIdAndDelete(req.params.id)
        .then(()=>res.json('User deleted!'))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/update/:id').post((req,res)=>{
    User.findById(req.params.id)
        .then(user=>{
            user.email = req.body.email;
            user.parola = req.body.parola;
            user.nume = req.body.nume;
            user.prenume = req.body.prenume;
            user.telefon = Number(req.body.telefon);
            user.adresa = req.body.adresa;
            user.pozitie = Number(req.body.pozitie);

            user.save()
                .then(()=>res.json('User updated!'))
                .catch(err => res.status(400).json('Error: '+err));
        })
        .catch(err => res.status(400).json('Error: '+err));
});

module.exports = router;