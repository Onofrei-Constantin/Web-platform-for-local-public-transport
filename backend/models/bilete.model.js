const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bileteSchema = new Schema({
    tipImagine : {type: String, required:true},
    numeBilet :{type: String, required:true},
    pret : {type: Number, required:true},
    valabilitateInfo : {type: String, required:true},
    valabilitateTip : { type : String, required:true},
    tip:{type:String,required:true},
    periodata:{type:Number,required:true,default:1},
    activ: {type:Boolean,required:true},
    tipBilet: {type:String,default:null},
},{
    timestamps:true,    
});

const Bilete = mongoose.model('Bilete', bileteSchema);

module.exports = Bilete;