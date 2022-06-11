let Bilet = require('../models/bilete.model');

exports.bilete =(req,res) =>{
    Bilet.find().sort({"tipImagine":"-1"})
        .then(bilete => res.json(bilete))
        .catch(err=> res.status(400).json('Error: '+ err));
};

exports.bileteAdauga =(req,res)=>{
    const tipImagine = req.body.tipImagine;
    const numeBilet = req.body.numeBilet;
    const pret = Number(req.body.pret);
    const valabilitateInfo = req.body.valabilitateInfo;
    const valabilitateTip = req.body.valabilitateTip;
    const tip = req.body.tip;
    const perioada= Number(req.body.perioada);
    const activ = req.body.activ;
    const tipBilet= req.body.tipBilet;
    
    const newBilet = new Bilet({tipImagine,numeBilet,pret,valabilitateInfo,valabilitateTip,tip,perioada,activ,tipBilet});

    newBilet.save()
        .then(()=>res.json('Bilet adaugat!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.bileteGaseste =(req,res)=>{
    Bilet.findById(req.params.id)
        .then(anunturi=>res.json(anunturi))
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
            bilete.tipImagine = req.body.tipImagine;
            bilete.numeBilet = req.body.numeBilet;
            bilete.pret = Number(req.body.pret);
            bilete.valabilitateInfo = req.body.valabilitateInfo;
            bilete.valabilitateTip = req.body.valabilitateTip;
            bilete.tip = req.body.tip;
            bilete.perioada= Number(req.body.perioada);
            bilete.activ = req.body.activ;
            bilete.tipBilet = req.body.tipBilet;
            
            bilete.save()
                .then(()=>res.json('Bilet actualizat!'))
                .catch(err => res.status(400).json('Error: '+err));
        })
        .catch(err => res.status(400).json('Error: '+err));
};
