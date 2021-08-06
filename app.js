'use strict'
require('dotenv').config();
const { timeStamp } = require('console');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port_number = process.env.PORT || Number.parseInt(process.env.PORT_NUMBER);
const pool = require('./config/postgres_config');

//use and set express json limit
app.use(express.json({ limit: '20kb' }));


app.get('/', async function (req, res) {
    try {
        res.status(200).send('Welcome to Nexapp!')
    } catch (error) {
        console.error(error);
    }
});

app.get('/api/products/list', async function (req, res) {
    try {
        let query = req.query,
            user_id = query.user_id,
            lt = query.lt,
            forward = query.forward,
            tab = query.tab;

        lt = (lt) ? new Date(query.lt * 1000) : null;
        forward = (forward) ? forward === 'true' : null;

        let res0;
        if (lt && tab && forward === true) {
            res0 = await pool.query('SELECT product_id, product_list.seller_id, EXTRACT (EPOCH FROM product_list.timestamp)::INTEGER AS timestamp, product_name, unit_price, currency, photo,'
                + 'seller_name, verified FROM product_list INNER JOIN seller_profile USING (seller_id) WHERE product_list.timestamp > $1 AND tab = $2 LIMIT 10', [lt, tab]);
        }
        else if (lt && tab && forward === false) {
            res0 = await pool.query('SELECT product_id, product_list.seller_id, EXTRACT (EPOCH FROM product_list.timestamp)::INTEGER AS timestamp, product_name, unit_price, currency, photo,'
                + 'seller_name, verified FROM product_list INNER JOIN seller_profile USING (seller_id) WHERE product_list.timestamp < $1 AND tab = $2 LIMIT 10', [lt, tab]);
        }
        else {
            res0 = await pool.query('SELECT product_id, product_list.seller_id, EXTRACT (EPOCH FROM product_list.timestamp)::INTEGER AS timestamp, product_name, unit_price, currency, photo,'
                + 'seller_name, verified FROM product_list INNER JOIN seller_profile USING (seller_id) WHERE tab = $1 LIMIT 10 ', [tab]);
        }
        res.status(200).send({ status: true, data: res0.rows });
    } catch (error) {
        console.error(error);
    }
});

app.get('/api/products/product_details', async function (req, res) {
    try {
        let query = req.query,
            product_id = query.product_id,
            user_id = query.user_id;

        let res0 = await pool.query('SELECT product_id, product_list.seller_id, product_name, unit_price, currency, photo, seller_name, verified, product_desc, delivery_method, avail_colors, avail_sizes, avail_quantity,' +
            'pckg_fee, delivery_fee FROM product_list INNER JOIN seller_profile USING (seller_id) WHERE product_id = $1', [product_id]);

        res.status(200).send({ status: true, data: res0.rows[0] });
    } catch (error) {
        console.error(error);
    }
});


app.get('/api/user/cart', async function (req, res) {
    try {
        let query = req.query,
            user_id = query.user_id;

        let res0 = await pool.query('SELECT item_id, product_id, user_id, quantity, shopping_cart.delivery_method, product_color, product_size, unit_price, delivery_addr, ' + 
        'product_name, product_desc, photo, product_list.delivery_fee, product_list.pckg_fee, product_list.seller_id, seller_name, verified FROM shopping_cart INNER JOIN product_list USING (product_id) INNER JOIN seller_profile USING (seller_id) WHERE user_id = $1', [user_id]);

        res0.rows.forEach((element, i) => {res0.rows[i].total = (element.unit_price * element.quantity) + element.delivery_fee + element.pckg_fee;})
        res.status(200).send({ status: true, data: res0.rows })
    } catch (error) {6
        console.error(error);
    }
});


server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`);
});