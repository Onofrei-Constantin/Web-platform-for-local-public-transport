const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ruteSchema = new Schema({
    linie: {type: String, required:true},
    denumire: {type: String, required:true},
    numeStatii: {type: Array, required:true},
    observatii: {type: Array},
    luni_vineri: {
        primele_curse: Array,
        ultimele_curse: Array,
    },
    sambata_duminica:{
        primele_curse_sambata: Array,
        ultimele_curse_sambata: Array,
        primele_curse_duminica: Array,
        ultimele_curse_duminica: Array,
    }
},{
    timestamps:true,    
});

const Rute = mongoose.model('Rute', ruteSchema);

module.exports = Rute;