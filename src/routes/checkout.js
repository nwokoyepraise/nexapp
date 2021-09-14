const router = require('express').Router();
const checkout_handler = require('../services/checkout_handler');

module.exports = router.post('', async function (req, res, next) {
    try {
        let body = req.body,
            user_id = body.user_id,
            item_id = body.item_id,
            card_number = body.card_number,
            cvv = body.cvv,
            expiry_month = body.expiry_month,
            expiry_year = body.expiry_year,
            fullname = body.fullname,
            email = body.email,
            phone_number = body.phone_number;

        let obj = { card_number: card_number, cvv: cvv, expiry_month: expiry_month, expiry_year: expiry_year, fullname: fullname, email: email, phone_number: phone_number }

        //perform transaction with checkout_handler service
        res.locals.data = await checkout_handler(user_id, item_id, obj);

        //revert response to user
        next();

    } catch (error) {
        console.error(error);
    }
});



