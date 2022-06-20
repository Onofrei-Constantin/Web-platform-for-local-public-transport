const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vanzariSchema = new Schema({
    idSesiune : {type:String,default:null},
    numeBilet :{type: String, required:true},
    pret : {type: Number, required:true},
    dataStart :{type: Date, default:null},
    dataStop :{type: Date, default:null},
    user : {type:String, required:true},
    nominal: {type:String,required:true},
    expirat:{type: Boolean, required:true,default:false},
    activ : {type: Boolean, required:true},
    anulat: {type:Boolean, required:true, default:false},
    tip : {type: String, required:true},
    valabilitateTip : { type : String, required:true},
    perioada:{type:Number,required:true,default:1},
    idPayment : {type:String,default:null},
    tipPersoana: {type:String,default:null},
    cerereValidare: {type: Boolean, default:false},
    cnp:{type:Number,default:null},
    idBilet:{type:String,required:true},
    verificat:{type:Boolean,default:false},
    data_si_ora_cursei:{type:Date,default:null},
    numarul_mijlocului_de_transport:{type:String,default:null},
    ruta_cursei:{type:String,default:null},
    codQrDecodat:{type:String,required:true,unique:true},
    inVanzare: {type: Boolean, default:true},
},{
    timestamps:true,    
});

const Vanzare = mongoose.model('Vanzare', vanzariSchema);

module.exports = Vanzare;