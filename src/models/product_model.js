const pool = require('../config/postgres_config');

module.exports.retrieve_data = async function (fields = [], product_id) {
    try {
        return await pool.query(`SELECT ${fields.join(',')} FROM product_list WHERE product_id = $1`, [product_id]);
    } catch (error) {
        console.error(error);
    }
}

module.exports.set_avail_quantity = async function (quantity, product_id) {
    try {
        return await pool.query("UPDATE product_list SET avail_quantity = $1 WHERE product_id = $2", [quantity, product_id]);
    } catch (error) {
        console.error(error);
    }
}

module.exports.product_details = async function (product_id) {
    try {
        //inner join query for product and seller data on product list and seller profile tables
        return await pool.query('SELECT product_id, product_list.seller_id, product_name, unit_price, currency, photo, seller_name, verified, product_desc, delivery_methods, avail_colors, avail_sizes, avail_quantity,' +
            'pckg_fee, delivery_fee FROM product_list INNER JOIN seller_profile USING (seller_id) WHERE product_id = $1', [product_id]);
    } catch (error) {
        console.error(error);
    }

}

module.exports.product_list = async function (lt, tab, forward) {
    try {
        let res0;
        //condition where pagination fields exists and pagination is in the forwards direction
        if (lt && tab && forward === true) {
            res0 = await pool.query('SELECT product_id, product_list.seller_id, EXTRACT (EPOCH FROM product_list.timestamp)::INTEGER AS timestamp, product_name, unit_price, currency, photo,'
                + 'seller_name, verified FROM product_list INNER JOIN seller_profile USING (seller_id) WHERE product_list.timestamp > $1 AND tab = $2 LIMIT 10', [lt, tab]);
        }
        //condition where pagination fields exists and pagination is in the backwards direction
        else if (lt && tab && forward === false) {
            res0 = await pool.query('SELECT product_id, product_list.seller_id, EXTRACT (EPOCH FROM product_list.timestamp)::INTEGER AS timestamp, product_name, unit_price, currency, photo,'
                + 'seller_name, verified FROM product_list INNER JOIN seller_profile USING (seller_id) WHERE product_list.timestamp < $1 AND tab = $2 LIMIT 10', [lt, tab]);
        }
        //condition where pagination values does not exist i.e. default request
        else {
            res0 = await pool.query('SELECT product_id, product_list.seller_id, EXTRACT (EPOCH FROM product_list.timestamp)::INTEGER AS timestamp, product_name, unit_price, currency, photo,'
                + 'seller_name, verified FROM product_list INNER JOIN seller_profile USING (seller_id) WHERE tab = $1 LIMIT 10 ', [tab]);
        }
        return res0;
    } catch (error) {
        console.error(error);
    }
}