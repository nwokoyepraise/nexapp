const pool = require('../config/postgres_config');
const error_logger = require('../utils/error_logger');

module.exports = function (app) {
    app.get('/api/products/product_details', async function (req, res) {
        try {
            let query = req.query,
                product_id = query.product_id,
                user_id = query.user_id;

            //inner join query for product and seller data on product list and seller profile tables
            let res0 = await pool.query('SELECT product_id, product_list.seller_id, product_name, unit_price, currency, photo, seller_name, verified, product_desc, delivery_methods, avail_colors, avail_sizes, avail_quantity,' +
                'pckg_fee, delivery_fee FROM product_list INNER JOIN seller_profile USING (seller_id) WHERE product_id = $1', [product_id]);

            //return if product is not found i.e !exist
            if (!res0.rowCount > 0) { return res.status(404).send({ status: false, message: 'Product not found!' }); }

            //send data response to user
            res.status(200).send({ status: true, data: res0.rows[0] });
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: false, message: 'Internal Server Error' });
            error_logger('/api/products/product_details', error);
        }
    });
}