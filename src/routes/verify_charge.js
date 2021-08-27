const flutterwave = require('../config/flutterwave_config');
const router = require('express').Router();
const verify_charge_handler = require('../services/verfy_charge_handler');

module.exports = router.post('', async function (req, res) {
    try {
        let body = req.body,
            tx_id = body.tx_id,
            user_id = body.user_id;

        let data = await verify_charge_handler(tx_id)

        //revert response to user
        res.status(200).send({ status: data.status, data: data.data });

    } catch (error) {
        console.error(error);
    }
});
