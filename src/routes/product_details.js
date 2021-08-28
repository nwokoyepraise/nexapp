const router = require('express').Router();
const product_handler = require('../services/product_handler');
const base_response = require('./base_response');

module.exports = router.get('', async function (req, res) {
    try {
        let query = req.query,
            product_id = query.product_id,
            user_id = query.user_id;

        //retrieve product_details using product handler service
        let data = await product_handler.product_details(product_id);
 
        //revert response to user
        base_response.send_response(res, data);

    } catch (error) {
        console.error(error);
    }
});
