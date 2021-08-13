const flutterwave = require('../config/flutterwave_config');

module.exports = function (app) {
    app.post('/api/checkout/verify_charge', async function (req, res) {
        try {
            let body = req.body,
                tx_id = body.tx_id,
                user_id = body.user_id;

            const payload = { "id": tx_id }
            const response = await flutterwave.Transaction.verify(payload)

            if (response.status === 'success') {
                return res.status(200).send({ status: true, data: { message: 'Transaction was successful!' } });
            } else { return res.status(200).send({ status: false, data: { message: 'Transaction was not successful or does not exist!' } }); }
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: false, message: 'Internal Server Error' });
            error_logger('/api/products/product_details', error);
        }
    });
}
