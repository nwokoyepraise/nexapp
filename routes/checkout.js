"use strict"
require('dotenv').config();
const flutterwave = require('../config/flutterwave_config');
const crypt_gen = require('../util/crypt_gen');
const ENC_KEY = process.env.FLUTTER_ENC_KEY;
const user_exists = require('../util/user_exists');
const pool = require('../config/postgres_config');
const error_logger = require('../util/error_logger');

module.exports.checkout_item = function (app) {
    app.post('/api/checkout/item', async function (req, res) {
        try {
            let body = req.body,
                user_id = body.user_id,
                item_id = body.item_id,
                card_number = body.card_number,
                cvv = body.cvv,
                expiry_month = body.expiry_month,
                expiry_year = body.expiry_year,
                fullname = body.fullname,
                email = body.email,
                phone_number = body.phone_number;

            //return if user does not exist
            if (!await user_exists(user_id)) { return res.status(406).send({ status: false, message: 'User does not exist!' }); }

            //inner join query for product and shooping cart data on shooping cart and product list tables
            let res0 = await pool.query('SELECT product_id, quantity, user_id, delivery_method, product_color, product_size, product_list.unit_price,' +
                'product_list.delivery_fee, product_list.pckg_fee, product_list.currency, product_list.avail_quantity, product_list.avail_colors, product_list.avail_sizes,' +
                'product_list.delivery_methods FROM shopping_cart INNER JOIN product_list USING (product_id) WHERE item_id = $1', [item_id]);


            //return if item is not found
            if (!res0.rowCount > 0) { return res.status(404).send({ status: false, message: 'Item does not exist!' }); }
            res0 = res0.rows[0];

            //check and return if user is not the owner of item
            if (res0.user_id != user_id) { return res.status(406).send({ status: false, message: 'User is not the owner of resource!' }); }

            //check and return if product remaining stock quantity is less than requested quantity
            if (res0.avail_quantity < res0.quantity) { return res.status(406).send({ status: false, message: 'Quantity of item in cart is greater than available stock!' }); }

            //check and return if requested product sizes is no longer available
            if (!res0.avail_sizes.includes(res0.product_size)) { return res.status(406).send({ status: false, message: 'Requested product size is no longer availabe for item!' }); }

            //check and return if requested product color is no longer available
            if (!res0.avail_colors.includes(res0.product_color)) { return res.status(406).send({ status: false, message: 'Requested product color is no longer availabe for item!' }); }

            //check and return if requested delivery method is no longer available for product
            if (!res0.delivery_methods.includes(res0.delivery_method)) { return res.status(406).send({ status: false, message: 'Requested delivery method is no longer availabe for item!' }); }

            //calculate item total price
            let total_price = (res0.unit_price * res0.quantity) + res0.delivery_fee + res0.pckg_fee;

            const payload = {
                "card_number": card_number,
                "cvv": cvv,
                "expiry_month": expiry_month,
                "expiry_year": expiry_year,
                "currency": res0.currency,
                "amount": total_price,
                "redirect_url": 'https://www.nexbuydistrict.com/',
                "fullname": fullname,
                "email": email,
                "phone_number": phone_number,
                "enckey": ENC_KEY,
                "tx_ref": crypt_gen.gen(24)
            }

            //make charge on card
            const response = await flutterwave.Charge.card(payload)

            if (response.meta.authorization.mode === 'pin') {
                let payload2 = payload
                payload2.authorization = {
                    "mode": "pin",
                    "fields": [
                        "pin"
                    ],
                    "pin": 3310
                }
                const reCallCharge = await flutterwave.Charge.card(payload2)

                //validate payment
                const callValidate = await flutterwave.Charge.validate({
                    "otp": "12345",
                    "flw_ref": reCallCharge.data.flw_ref
                })

                //update data in DB and return transaction data to user
                if (callValidate.status === 'success') {
                    delete callValidate.data.card;
                    delete callValidate.data.customer;
                    res.status(200).send({ status: true, data: callValidate.data });
                    try {
                        await pool.query("DELETE FROM shopping_cart WHERE item_id = $1", [item_id]);
                        await pool.query("UPDATE product_list SET avail_quantity = $1 WHERE product_id = $2", [res0.avail_quantity - res0.quantity, res0.product_id]);
                    } catch { console.error(error); }
                }

            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: false, message: 'Internal Server Error' });
            error_logger('/api/products/product_details', error);
        }
    });
}



