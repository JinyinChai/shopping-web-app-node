const User = require("../models/User");
const {query} = require("express");
const router = require("express").Router();
// const KEY = process.env.STRIPE_KEY;
const KEY = "sk_test_51M7rkFKl0OVVHlCKWxNg7FsTuX0PhN1NHtNsx41j86qDbgjPm12c8WaTzAIzbMsiuIeuJ4goseRB0pv9swAwDdx100pt1bDino";
const stripe = require("stripe")(KEY);

router.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            return res.status(500).json(stripeErr);
        } else {
            return res.status(200).json(stripeRes);
        }
    });
});

router.get("/", async (req, res) => {

    // const query = req.query.new;
    try{
        const payments = await stripe.charges.list({
            limit: 20,
        });
        // const payments = await stripe.charges.search({
        //     query: `refunded: \"false\"`,
        // });
        return res.status(200).json(payments);
    } catch (err){
        return res.status(500).json(err);
    }
})


router.get("/:id", async (req, res) => {

    // const query = req.query.new;
    try{
        const payments = await stripe.charges.retrieve(req.params.id);
        return res.status(200).json(payments);
    } catch (err){
        return res.status(500).json(err);
    }
})

router.get("/search/:postal_code", async (req, res) => {

    // const query = req.query.new;
    try{
        const payments = await stripe.charges.search({
            query: `billing_details.address.postal_code: \"${req.params.postal_code}\"`});
        return res.status(200).json(payments);
    } catch (err){
        return res.status(500).json(err);
    }
})


module.exports = router;