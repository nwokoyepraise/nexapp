const pool = require('../config/postgres_config');

module.exports.retrieve_data = async function (fields = [], item_id) {
    try {
        return await pool.query(`SELECT ${fields.join(',')} FROM shopping_cart WHERE item_id = $1`, [item_id]);
    } catch (error) {
        console.error(error)
    }
}

module.exports.add_item = async function (obj, user_id, item_id) {
    try {
        return await pool.query('INSERT INTO shopping_cart(item_id, product_id, user_id, quantity, delivery_method, product_color, product_size, delivery_addr) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [item_id, obj.product_id, user_id, obj.quantity, obj.delivery_method, obj.product_color, obj.product_size, obj.delivery_addr]);
    } catch (error) {
        console.error(error);
    }
}

module.exports.remove_item = async function (item_id) {
    try {
        return await pool.query('DELETE FROM shopping_cart WHERE item_id = $1', [item_id]);
    } catch (error) {
        console.error(error);
    }
}

module.exports.get_cart = async function (user_id) {
    try {
        //inner join query for shopping cart product list and seller data on shopping cart, product list and seller profile tables
        return await pool.query('SELECT item_id, product_id, user_id, quantity, delivery_method, product_color, product_size, unit_price, delivery_addr, ' +
            'product_name, product_desc, photo, product_list.delivery_fee, product_list.pckg_fee, product_list.seller_id, seller_name, verified FROM shopping_cart INNER JOIN product_list USING (product_id) INNER JOIN seller_profile USING (seller_id) WHERE user_id = $1', [user_id]);
    } catch (error) {
        console.error(error)
    }
}

module.exports.get_checkout_data = async function (item_id) {
    try {
        //inner join query for product and shopping cart data on shopping cart and product list tables
        return await pool.query('SELECT product_id, quantity, user_id, delivery_method, product_color, product_size, product_list.unit_price,' +
            'product_list.delivery_fee, product_list.pckg_fee, product_list.currency, product_list.avail_quantity, product_list.avail_colors, product_list.avail_sizes,' +
            'product_list.delivery_methods FROM shopping_cart INNER JOIN product_list USING (product_id) WHERE item_id = $1', [item_id]);
    } catch (error) {
        console.error(error)
    }
}