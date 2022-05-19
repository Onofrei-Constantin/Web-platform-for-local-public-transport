const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ruteSchema = new Schema({
    denumire: {type: String, required:true},
    numeStatii: {type: Array, required:true},
},{
    timestamps:true,    
});

const Rute = mongoose.model('Rute', ruteSchema);

module.exports = Rute;