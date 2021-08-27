const crypt_gen = require('../utils/crypt_gen');
const router = require('express').Router();
const shopping_cart_handler = require('../services/shopping_cart_handler');


router.post('/add_item', async function (req, res) {
    try {
        let body = req.body,
            user_id = body.user_id,
            item_id = `item_${crypt_gen.gen(7)}`,
            product_id = body.product_id,
            quantity = body.quantity,
            delivery_method = body.delivery_method,
            product_color = body.product_color,
            product_size = body.product_size,
            delivery_addr = body.delivery_addr;

        //build object
        let obj = { product_id: product_id, quantity: quantity, delivery_method: delivery_method, product_color: product_color, product_size, product_size, delivery_addr: delivery_addr };

        //add item with shopping cart handler service
        let data = await shopping_cart_handler.add_item(obj, user_id, item_id);

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
        console.error(error)
    }
});


router.post('/remove_item', async function (req, res) {
    try {
        let body = req.body,
            user_id = body.user_id,
            item_id = body.item_id;

        //remove item with shopping cart handler service
        let data = await shopping_cart_handler.remove_item(user_id, item_id);

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
        console.error(error)
    }
});


router.get('', async function (req, res) {
    try {
        let query = req.query,
            user_id = query.user_id;

        //get cart with shopping cart handler service
        let data = await shopping_cart_handler.get_cart(user_id);

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


module.exports = router;