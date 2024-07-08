const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    product_id: { type: String },
    product_name: { type: String },
    amount: { type: Number },
    bought_by: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('orders', orderSchema);