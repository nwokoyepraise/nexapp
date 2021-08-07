'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port_number = process.env.PORT || Number.parseInt(process.env.PORT_NUMBER);
const home = require('./routes/home');
const product_list = require('./routes/product_list');
const cart_mgmt = require('./routes/cart_mgmt');
const product_detail = require('./routes/product_detail');

//use and set express json limit
app.use(express.json({ limit: '20kb' }));

//load routes
home(app);
product_detail(app);
product_list(app);
cart_mgmt.get_cart(app);

server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`);
});