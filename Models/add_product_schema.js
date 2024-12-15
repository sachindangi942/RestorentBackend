const { required } = require("joi");
const mongoose = require("mongoose");

const add_product = new mongoose.Schema({
    code: {
        type: String,
        required:true,
        unique: true
    },
    iteam: {
        type: String,
        required:true,
        unique: true
    },
    price: {
        type: Number,
        required:true
    },
    quantity: {
        type:Number,
        default:0
    }
});

const  addProduct = mongoose.model("product",add_product);
module.exports =addProduct;