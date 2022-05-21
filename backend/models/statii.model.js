const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statiiSchema = new Schema({
    dataRute : {
    lat : Number,
    lng : Number,
    label : String,
    marc: String
    }
},{
    timestamps:true,    
});

const Statii = mongoose.model('Statii', statiiSchema);

module.exports = Statii;