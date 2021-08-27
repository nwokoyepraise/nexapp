const router = require('express').Router();
const product_handler = require('../services/product_handler');

module.exports = router.get('', async function (req, res) {
    try {
        let query = req.query,
            product_id = query.product_id,
            user_id = query.user_id;

        //retrieve product_details using product handler service
        let data = await product_handler.product_details(product_id);
 
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
