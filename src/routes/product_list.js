const router = require('express').Router();
const product_handler = require('../services/product_handler');

module.exports = router.get('', async function (req, res, next) {
    try {
        let query = req.query;

        //retrieve product_list using product handler service
        res.locals.data = await product_handler.product_list(query);

        //revert response to user
        next();

    } catch (error) {
        console.error(error);
    }
});