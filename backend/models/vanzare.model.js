const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vanzariSchema = new Schema({
    idTranzactie : {type:String,default:null},
    numeBilet :{type: String, required:true},
    pret : {type: Number, required:true},
    dataStart :{type: Date, default:null},
    dataStop :{type: Date, default:null},
    codQR : {type:String,required:true},
    user : {type:String, required:true},
    tip: {type:String,required:true},
    expirat:{type: Boolean, required:true,default:false},
    activ : {type: Boolean, required:true},
    anulat: {type:Boolean, required:true, default:false},
    tipImagine : {type: String, required:true},
    valabilitateTip : { type : String, required:true},
    perioada:{type:Number,required:true,default:1},
    idPayment : {type:String,default:null},
    tipBilet: {type:String,default:null},
    cerereValidare: {type: Boolean, default:false},
    cnp:{type:Number,default:null},
    ultimaCursa:{type:String,default:null},
    dataUltimaCursa:{type:Date,default:null}
},{
    timestamps:true,    
});

const Vanzare = mongoose.model('Vanzare', vanzariSchema);

module.exports = Vanzare;