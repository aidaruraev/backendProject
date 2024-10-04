const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // Optional field for product image URL
    category: { type: String }, // Optional field for product category
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
