const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenListSchema = new Schema({
    token:{type:String,required:true},
},{
    timestamps:true,    
});

const RefreshTokenList = mongoose.model('RefreshTokenList', refreshTokenListSchema);

module.exports = RefreshTokenList;