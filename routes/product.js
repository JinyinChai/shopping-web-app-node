const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAndAdminAndSeller, verifyTokenAndAdminAndTheSeller} = require("./verifiedToken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const Product = require("../models/Product");

//create
router.post("/newProduct", verifyTokenAndAdminAndSeller, async (req, res) => {
    const newProduct = new Product({seller: req.user.id, ...req.body});

    try {
        const savedProduct = await newProduct.save();
        return res.status(200).json(savedProduct);
    } catch (err){
        return res.status(500).json(err);
    }
});

//update
router.put("/:uid/:id", verifyTokenAndAdminAndTheSeller, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        return res.status(200).json(updatedProduct);
    } catch (err){
        return res.status(500).json(err);
    }
})


//delete
router.delete("/:uid/:id", verifyTokenAndAdminAndTheSeller, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json("Product has been deleted.");
    } catch (err){
        return res.status(500).json(err);
    }
})



//get product
router.get("/find/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        return res.status(200).json(product);
    } catch (err){
        return res.status(500).json(err);
    }
})

//get all products
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const qSeller = req.query.seller;
    try{
        let products;
        if (qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else if (qSeller) {
            products = await Product.find({
                seller: {
                    $eq: qSeller,
                }
            });
        } else {
            products = await Product.find();
        }

        return res.status(200).json(products);
    } catch (err){
        return res.status(500).json(err);
    }
})

module.exports = router;