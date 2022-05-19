const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bileteSchema = new Schema({
    tip : {type: String, required:true},
    numeBilet :{type: String, required:true},
    pret : {type: Number, required:true},
    valabilitate : {type: String, required:true},
},{
    timestamps:true,    
});

const Bilete = mongoose.model('Bilete', bileteSchema);

module.exports = Bilete;