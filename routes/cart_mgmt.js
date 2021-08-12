const pool = require('../config/postgres_config');
const error_logger = require('../util/error_logger');
const Item = require('../model/item_model');
const check_for_null = require('../util/null_undefined_checker');
const crypt_gen = require('../util/crypt_gen');
const user_exists = require('../util/user_exists');

module.exports.add_item = function (app) {
    app.post('/api/user/cart/add_item', async function (req, res) {
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

            //return if user does not exist
            if (!await user_exists(user_id)) { return res.status(406).send({ status: false, message: 'User does not exist!' }); }

            //build object
            let obj = { product_id: product_id, quantity: quantity, delivery_method: delivery_method, product_color: product_color, product_size, product_size, delivery_addr: delivery_addr };

            //retrieve product info from DB
            let res0 = await pool.query('SELECT avail_quantity, avail_sizes, avail_colors, delivery_methods FROM product_list WHERE product_id = $1', [product_id]);
            
            //return if product does not exist
            if (!res0.rowCount > 0) {return res.status(404).send({status: false, message:'Product not found!'})}
            res0 = res0.rows[0];

            //check if any of the request fields is null and return appropriately
            let isNull = check_for_null(obj);
            if (!isNull.valid) { return res.status(400).send({ status: false, message: `${isNull.field} field cannot be null or not exist!` }); }

            //define item from Item model
            const item = new Item(res0.avail_quantity, res0.avail_sizes, res0.avail_colors, res0.delivery_methods);

            //check if product request fields is available based on product info retrieved from DB. If any of the fields is not available, return
            let isAvail = item.isValid(quantity, product_size, product_color, delivery_method);

            if (!isAvail.valid) { return res.status(400).send({ status: false, message: `Value of ${isAvail.field} field is not available for the product!` }); }

            //insert item into user shopping cart
            let res1 = await pool.query('INSERT INTO shopping_cart(item_id, product_id, user_id, quantity, delivery_method, product_color, product_size, delivery_addr) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [item_id, product_id, user_id, quantity, delivery_method, product_color, product_size, delivery_addr]);

            //if not successful, revert back to user
            if (!res1.rowCount > 0) { return res.status(500).send({ status: false, message: 'Unable to add item at this time. Please try again later.' }); }

            delete res1.rows[0].timestamp;
            //if succssful revert inserted item info to user
            return res.status(200).send({ status: true, data: res1.rows[0] });

        } catch (error) {
            console.error(error)
            res.status(500).send({ status: false, message: 'Internal Server Error' });
            error_logger('/api/products/list', error);
        }
    });
}

module.exports.remove_item = function (app) {
    app.post('/api/user/cart/remove_item', async function (req, res) {
        try {
            let body = req.body,
                user_id = body.user_id,
                item_id = body.item_id;

                
            //return if user does not exist
            if (!await user_exists(user_id)) { return res.status(406).send({ status: false, message: 'User does not exist!' }); }

            //select user_id of item owner in DB
            let res0 = await pool.query('SELECT user_id FROM shopping_cart WHERE item_id = $1', [item_id]);

            //revert if item is not found
            if (!res0.rowCount > 0) { return res.status(404).send({ status: false, message: 'Item does not exist!' }); }

            //check and return if user is not the owner of item
            if (res0.rows[0].user_id != user_id) { return res.status(406).send({ status: false, message: 'User is not the owner of resource!' }); }

            //remove item from DB
            let res1 = await pool.query('DELETE FROM shopping_cart WHERE item_id = $1', [item_id]);

            if (!res1.rowCount > 0) { return res.status(500).send({ status: false, message: 'Unable to remove item at this time, please try again later!' }); }

            //send data response to user
            res.status(200).send({ status: true, data: { message: 'Item successfully removed!' } });

        } catch (error) {
            console.error(error)
            res.status(500).send({ status: false, message: 'Internal Server Error' });
            error_logger('/api/products/list', error);
        }
    });
}

module.exports.get_cart = function (app) {
    app.get('/api/user/cart', async function (req, res) {
        try {
            let query = req.query,
                user_id = query.user_id;

            //inner join query for shopping cart product list and seller data on shopping cart, product list and seller profile tables
            let res0 = await pool.query('SELECT item_id, product_id, user_id, quantity, delivery_method, product_color, product_size, unit_price, delivery_addr, ' +
                'product_name, product_desc, photo, product_list.delivery_fee, product_list.pckg_fee, product_list.seller_id, seller_name, verified FROM shopping_cart INNER JOIN product_list USING (product_id) INNER JOIN seller_profile USING (seller_id) WHERE user_id = $1', [user_id]);

            //compute total amount for each item in the shopping cart
            res0.rows.forEach((element, i) => { res0.rows[i].total = (element.unit_price * element.quantity) + element.delivery_fee + element.pckg_fee; });

            //send data response to user
            res.status(200).send({ status: true, data: res0.rows })
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: false, message: 'Internal Server Error' });
            error_logger('/api/products/list', error);
        }
    });
}