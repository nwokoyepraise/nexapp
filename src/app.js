'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port_number = process.env.PORT || Number.parseInt(process.env.PORT_NUMBER);
const home = require('./routes/home');
const product_list = require('./routes/product_list');
const cart_mgmt = require('./routes/cart_mgmt');
const product_details = require('./routes/product_details');
const verify_charge = require('./routes/verify_charge');
const checkout = require('./routes/checkout');

//use and set express json limit
app.use(express.json({ limit: '20kb' }));

//load routes
app.use('/', home);
app.use('/api/products/product_details', product_details);
app.use('/api/products/list', product_list)
app.use('/api/user/cart', cart_mgmt);
app.use('/api/cart/checkout/item', checkout);
app.use('/api/cart/checkout/verify_charge', verify_charge);

server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`);
});