'use strict'
require('dotenv').config();
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
        return res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
});

app.get('/api/products/product_details', async function (req, res) {
    try {
        let query = req.query,
            product_id = query.product_id,
            user_id = query.user_id;

        //inner join query for product and seller data on product list and seller profile tables
        let res0 = await pool.query('SELECT product_id, product_list.seller_id, product_name, unit_price, currency, photo, seller_name, verified, product_desc, delivery_methods, avail_colors, avail_sizes, avail_quantity,' +
            'pckg_fee, delivery_fee FROM product_list INNER JOIN seller_profile USING (seller_id) WHERE product_id = $1', [product_id]);

        //return empty if returned rowCount is not greater than zero 
        if (!res0.rowCount > 0) { return res.status(200).send({ status: true, data: [] }); }

        //send data response to user
        res.status(200).send({ status: true, data: res0.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
});


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
        return res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
});


server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`);
});