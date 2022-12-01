const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        isAdmin: req.body.isAdmin,
        isSeller: req.body.isSeller,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err){
        res.status(500).json(err);
    }
})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });

        !user && res.status(401).json("Wrong credentials!")
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        Originalpassword !== req.body.password && res.status(401).json("Wrong credentials!");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,

        }, process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
        const {password, ...others} = user._doc;
        

        res.status(200).json({...others, accessToken});

    } catch(err) {
        // res.status(500).json(err);
    }

});

module.exports = router;