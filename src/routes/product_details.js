const router = require('express').Router();
const product_handler = require('../services/product_handler');

module.exports = router.get('', async function (req, res, next) {
    try {
        let query = req.query,
            product_id = query.product_id,
            user_id = query.user_id;

        //retrieve product_details using product handler service
        res.locals.data = await product_handler.product_details(product_id);
 
        //revert response to user
        next()

    } catch (error) {
        console.error(error);
    }
});
