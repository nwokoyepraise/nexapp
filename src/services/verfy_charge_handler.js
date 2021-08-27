const flutterwave = require('../config/flutterwave_config');
const error_logger = require('../utils/error_logger');


module.exports = async function (tx_id) {
    try {
        const payload = { "id": tx_id }
        const response = await flutterwave.Transaction.verify(payload)

        if (response.status === 'success') {
            return { status: true, data: { message: 'Transaction was successful!' } }
        } else {
            return { status: false, status_code: 200, data: { message: 'Transaction was not successful or does not exist!' } }
        }
    } catch (error) {
        console.error(error);
        error_logger('/api/products/product_details', error);
    }
}