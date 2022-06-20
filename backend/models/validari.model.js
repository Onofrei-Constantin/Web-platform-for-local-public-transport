const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const validariSchema = new Schema({
    user : {type:String,required:true},
    idTranzactie : {type:String,required:true},
    imagini :{type: Array, required:true},
    anulat :{type:Boolean,default:false},
    validat :{type:Boolean,default:false},
},{
    timestamps:true,    
});

const Validari = mongoose.model('Validari', validariSchema);

module.exports = Validari;