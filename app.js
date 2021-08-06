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
            lt = new Date(query.lt),
            forward = query.forward,
            tab = query.tab;

        let res0;
        if (lt && tab && forward == true) {
            res0 = await pool.query('SELECT product_list.product_id, product_list.seller_id, product_list.product_name, product_list.unit_price, product_list.currency, product_list.photo,'
            + 'seller_profile.seller_name, seller_profile.verified FROM product_list INNER JOIN seller_profile ON product_list.seller_id = seller_profile.seller_id WHERE product.timestamp > $1 AND product_list.tab = $2 LIMIT 10', [lt, tab]);
        }
        else if (lt && tab && forward == false) {
            res0 = await pool.query('SELECT product_list.product_id, product_list.seller_id, product_list.product_name, product_list.unit_price, product_list.currency, product_list.photo,'
            + 'seller_profile.seller_name, seller_profile.verified FROM product_list INNER JOIN seller_profile ON product_list.seller_id = seller_profile.seller_id WHERE product.timestamp < $1 AND product_list.tab = $2 LIMIT 10', [lt, tab]);
        }
        else {
            res0 = await pool.query('SELECT product_list.product_id, product_list.seller_id, product_list.product_name, product_list.unit_price, product_list.currency, product_list.photo,'
                + 'seller_profile.seller_name, seller_profile.verified FROM product_list INNER JOIN seller_profile ON product_list.seller_id = seller_profile.seller_id WHERE product_list.tab = $1 LIMIT 10 ', [tab]);
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

        let res0 = await pool.query('SELECT * FROM product_list WHERE product_id = $1', [product_id]);
        res.status(200).send({ status: true, data: res0.rows[0] });
    } catch (error) {
        console.error(error);
    }
});


app.get('/api/user/cart', async function (req, res) {
    try {
        let query = req.query,
            user_id = query.user_id;

        let res0 = await pool.query('SELECT * FROM shopping_cart WHERE user_id = $1', [user_id]);
        res.status(200).send({ status: true, data: res0.rows })
    } catch (error) {
        console.error(error);
    }
});


server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`);
});