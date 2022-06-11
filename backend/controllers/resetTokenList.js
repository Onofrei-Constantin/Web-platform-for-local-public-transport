let ResetTokenList = require('../models/resetTokenList.model');

exports.resetTokenList = async (req,res)=>{
    const {token} = req.body;
    await ResetTokenList.findOne({token})
        .then(token=>res.json(token))
        .catch(err => res.status(400).json('Error: '+err));
};


exports.addResetTokenList = async (req,res)=>{
    const token = req.body.token;
    const resetTokenList= new ResetTokenList({token});
    await resetTokenList.save()
        .then(()=>res.json('Token adaugat!'))
        .catch(err => res.status(400).json('Error: '+err));
};

exports.deleteResetTokenList = async (req,res)=>{
    await ResetTokenList.findByIdAndDelete(req.params.id)
        .then(()=>res.json('Token sters!'))
        .catch(err => res.status(400).json('Error: '+err));
};