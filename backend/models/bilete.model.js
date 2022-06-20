const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bileteSchema = new Schema({
    tip : {type: String, required:true},
    numeBilet :{type: String, required:true},
    pret : {type: Number, required:true},
    valabilitateInfo : {type: String, required:true},
    valabilitateTip : { type : String, required:true},
    nominal:{type:String,required:true},
    perioada:{type:Number,required:true,default:1},
    activ: {type:Boolean,required:true},
    tipPersoana: {type:String,default:null},
    inVanzare: {type:Boolean,required:true,default:true,},
},{
    timestamps:true,    
});

const Bilete = mongoose.model('Bilete', bileteSchema);

module.exports = Bilete;