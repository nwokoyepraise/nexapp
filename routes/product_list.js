const pool = require('../config/postgres_config');
const error_logger = require('../util/error_logger');

module.exports = function (app) {
    app.get('/api/products/list', async function (req, res) {
        try {
            let query = req.query,
                user_id = query.user_id,
                lt = query.lt,
                forward = query.forward,
                tab = query.tab;

            //check if tab field is valid. If not valid return appropraitely
            if (!tab || (tab != 'FOR YOU' && tab != 'TRENDING' && tab != 'CATEGORIES' && tab != 'EARLY ACCESS' && tab != 'SPECIALS')) {
                return res.status(400).send({ status: false, message: 'Null or invalid tab field!' });
            }

            //multiplying timestamp value by 1000 in other to be in miliseconds instead of seconds as required by JS Date Object otherwise set field as null if not exist
            lt = (lt) ? new Date(query.lt * 1000) : null;
            forward = (forward) ? forward === 'true' : null;

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
            //send data response to user
            res.status(200).send({ status: true, data: res0.rows });
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: false, message: 'Internal Server Error' });
            error_logger('/api/products/list', error);
        }
    });
}