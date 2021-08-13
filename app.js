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
//const verify_charge = require('./routes/verify_charge');
const checkout = require('./routes/checkout');

//use and set express json limit
app.use(express.json({ limit: '20kb' }));

//load routes
home(app);
product_detail(app);
product_list(app);
cart_mgmt.get_cart(app);
cart_mgmt.add_item(app);
cart_mgmt.remove_item(app);
//verify_charge(app);
checkout.checkout_item(app);

server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`);
});