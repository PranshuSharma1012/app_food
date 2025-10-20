const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    size:{
        type:String,
        require:true
    },
    stock:{
        type:Number,
        require:true,
        min:[0, 'Out Of stock']
        // set minimum value = out of stock 
    }
}, {timestamps:true});

module.exports = mongoose.model('Menu' , menuSchema);