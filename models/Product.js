const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        seller: {type: String, required: true},
        title: {type: String, required: true, unique: true},
        desc: {type: String, required: true},
        img: {type: String, required: true},
        categories: {type: Array},
        size: {type: Array, default: ["S", "M", "L"]},
        color: {type: Array, default: ["white", "black"]},
        price: {type: Number, required: true},
        instock: {type: Boolean, default: true},
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", ProductSchema);