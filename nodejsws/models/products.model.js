const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: { type: String, unique: true },
    price: { type: Number },
    detail: { type: String },
    stock: { type: Number },
    img: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('products', productSchema);