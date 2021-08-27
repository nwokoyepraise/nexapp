"use strict"
require('dotenv').config();
const user_exists = require('../utils/user_exists');
const shopping_cart_model = require('../models/shopping_cart_model');
const product_model = require('../models/product_model');
const error_logger = require('../utils/error_logger');
const flutterwave = require('../config/flutterwave_config');
const crypt_gen = require('../utils/crypt_gen');
const ENC_KEY = process.env.FLUTTER_ENC_KEY;


module.exports = function (user_id, item_id, obj) {
    try {
        return new Promise(async function (resolve, reject) {
            //return if user does not exist
            if (!await user_exists(user_id)) { resolve({ status: false, status_code: 406, message: 'User does not exist!' }); return; }

            let res0 = await shopping_cart_model.get_checkout_data(item_id);

            if (!res0.rowCount > 0) { resolve({ status: false, status_code: 404, message: 'Item does not exist!' }); return; }
            res0 = res0.rows[0];

            //check and return if user is not the owner of item
            if (res0.user_id != user_id) { resolve({ status: false, status_code: 406, message: 'User is not the owner of resource!' }); return; }

            //check and return if product remaining stock quantity is less than requested quantity
            if (res0.avail_quantity < res0.quantity) { resolve({ status: false, status_code: 406, message: 'Quantity of item in cart is greater than available stock!' }); return; }

            //check and return if requested product sizes is no longer available
            if (!res0.avail_sizes.includes(res0.product_size)) { resolve({ status: false, status_code: 406, message: 'Requested product size is no longer availabe for item!' }); return; }

            //check and return if requested product color is no longer available
            if (!res0.avail_colors.includes(res0.product_color)) { resolve({ status: false, status_code: 406, message: 'Requested product color is no longer availabe for item!' }); return; }

            //check and return if requested delivery method is no longer available for product
            if (!res0.delivery_methods.includes(res0.delivery_method)) { resolve({ status: false, status_code: 406, message: 'Requested delivery method is no longer availabe for item!' }); return; }

            //calculate item total price
            let total_price = (res0.unit_price * res0.quantity) + res0.delivery_fee + res0.pckg_fee;

            const payload = {
                "card_number": obj.card_number,
                "cvv": obj.cvv,
                "expiry_month": obj.expiry_month,
                "expiry_year": obj.expiry_year,
                "currency": res0.currency,
                "amount": total_price,
                "redirect_url": 'https://www.nexbuydistrict.com/',
                "fullname": obj.fullname,
                "email": obj.email,
                "phone_number": obj.phone_number,
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

                    try {
                        await shopping_cart_model.remove_item(item_id);
                        await product_model.set_avail_quantity(res0.avail_quantity - res0.quantity, res0.product_id);
                    } catch { console.error(error); }

                    resolve({ status: true, data: callValidate.data }); return;
                }
            }
        })
    } catch (error) {
        console.error(error);
        error_logger('/api/cart/checkout/item', error);
        return { status: false, status_code: 500, message: 'Internal Server Error' }
    }

}