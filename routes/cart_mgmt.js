const pool = require('../config/postgres_config');
const error_logger = require('../util/error_logger');

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