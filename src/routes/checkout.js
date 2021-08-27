const router = require('express').Router();
const checkout_handler = require('../services/checkout_handler');

module.exports = router.post('', async function (req, res) {
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

        let data = await checkout_handler(user_id, item_id, obj);

        //revert response to user
        switch (data.status) {
            case false:
                res.status(data.status_code).send({ status: false, message: data.message });
                break;

            case true:
                res.status(200).send({ status: true, data: data.data });
                break;
        }
    } catch (error) {
        console.error(error);
    }
});



