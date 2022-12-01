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
module.exports = router;