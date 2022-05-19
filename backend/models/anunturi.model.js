const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const anunturiSchema = new Schema({
    titlu : {type: String, required:true},
    tip : {type: String, required:true},
    text : {type: String, required:true},
    activ : {type:Boolean, required:true, default:true,},
    imagine : {type:String}
},{
    timestamps:true,    
});



const Anunturi = mongoose.model('Anunturi', anunturiSchema);

module.exports = Anunturi;