let Bilet = require('../models/bilete.model');

exports.bilete =(req,res) =>{
    Bilet.find({'inVanzare':true}).sort({"tip":"-1"})
        .then(bilete => res.json(bilete))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.bileteAdmin =(req,res) =>{
    Bilet.find().sort({"tip":"-1"})
        .then(bilete => res.json(bilete))
        .catch(err=> res.status(400).json('Error: '+ err));
};



exports.bileteActiveaza= (req,res) =>{
    Bilet.findByIdAndUpdate(req.body.id,{$set:{'inVanzare':true}})
        .then(bilete => res.status(200).json(bilete))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.bileteDezactiveaza= (req,res) =>{
    Bilet.findByIdAndUpdate(req.body.id,{$set:{'inVanzare':false}})
        .then(bilete => res.status(200).json(bilete))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.bileteAdauga =(req,res)=>{
    const tip = req.body.tip;
    const numeBilet = req.body.numeBilet;
    const pret = Number(req.body.pret);
    const valabilitateInfo = req.body.valabilitateInfo;
    const valabilitateTip = req.body.valabilitateTip;
    const nominal = req.body.nominal;
    const perioada= Number(req.body.perioada);
    const activ = req.body.activ;
    const tipPersoana= req.body.tipPersoana;
    const inVanzare = req.body.inVanzare;
    
    const newBilet = new Bilet({tip,numeBilet,pret,valabilitateInfo,valabilitateTip,nominal,perioada,activ,tipPersoana,inVanzare});

    newBilet.save()
        .then(()=>res.json('Bilet adaugat!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.bileteGaseste =(req,res)=>{
    Bilet.findById(req.body.id)
        .then(bilete=>res.json(bilete))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.bileteSterge = (req,res)=>{
    Bilet.findByIdAndDelete(req.params.id)
        .then(()=>res.json('Bilet sters!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.bileteActualizeaza =(req,res)=>{
    Bilet.findById(req.params.id)
        .then(bilete=>{
            bilete.tip = req.body.tip;
            bilete.numeBilet = req.body.numeBilet;
            bilete.pret = Number(req.body.pret);
            bilete.valabilitateInfo = req.body.valabilitateInfo;
            bilete.valabilitateTip = req.body.valabilitateTip;
            bilete.nominal = req.body.nominal;
            bilete.perioada= Number(req.body.perioada);
            bilete.activ = req.body.activ;
            bilete.tipPersoana = req.body.tipPersoana;
            bilete.inVanzare = req.body.inVanzare;
            
            bilete.save()
                .then(()=>res.json('Bilet actualizat!'))
                .catch(err => res.status(400).json('Error: '+err));
        })
        .catch(err => res.status(400).json('Error: '+err));
};
