const user_exists = require('../utils/user_exists');
const shopping_cart_model = require('../models/shopping_cart_model');
const product_model = require('../models/product_model');
const Item = require('../models/item_model');
const error_logger = require('../utils/error_logger');
const check_for_null = require('../utils/null_undefined_checker');

module.exports.add_item = async function (obj, user_id, item_id) {
    try {
        //return if user does not exist
        if (!await user_exists(user_id)) { return { status: false, status_code: 406, message: 'User does not exist!' } }

        //retrieve product info from DB
        let res0 = await product_model.retrieve_data(['avail_quantity', 'avail_sizes', 'avail_colors', 'delivery_methods'], obj.product_id)

        //return if product does not exist
        if (!res0.rowCount > 0) { return { status: false, status_code: 404, message: 'Product not found!' } }
        res0 = res0.rows[0];

        //check if any of the request fields is null and return appropriately
        let isNull = check_for_null(obj);
        if (!isNull.valid) { return { status: false, status_code: 400, message: `${isNull.field} field cannot be null or not exist!` } }

        //define item from Item model
        const item = new Item(res0.avail_quantity, res0.avail_sizes, res0.avail_colors, res0.delivery_methods);

        //check if product request fields is available based on product info retrieved from DB. If any of the fields is not available, return
        let isAvail = item.isValid(obj.quantity, obj.product_size, obj.product_color, obj.delivery_method);

        if (!isAvail.valid) { return { status: false, status_code: 400, message: `Value of ${isAvail.field} field is not available for the product!` } }

        //insert item into user shopping cart
        let res1 = await shopping_cart_model.add_item(obj, user_id, item_id)

        //if not successful, revert back to user
        if (!res1.rowCount > 0) { return { status: false, status_code: 500, message: 'Unable to add item at this time. Please try again later.' } }

        delete res1.rows[0].timestamp;
        //if succssful revert inserted item info to user
        return { status: true, data: res1.rows[0] }
    } catch (error) {
        console.error(error);
        error_logger('/api/user/cart/add_item', error);
        return { status: false, status_code: 500, message: 'Internal Server Error' }
    }
}

module.exports.remove_item = async function (user_id, item_id) {
    try {
        //return if user does not exist
        if (!await user_exists(user_id)) { return { status: false, status_code: 406, message: 'User does not exist!' } }

        //select user_id of item owner in DB
        let res0 = await shopping_cart_model.retrieve_data(['user_id'], item_id);

        //revert if item is not found
        if (!res0.rowCount > 0) { return { status: false, status_code: 404, message: 'Item does not exist!' } }

        //check and return if user is not the owner of item
        if (res0.rows[0].user_id != user_id) { return { status: false, status_code: 406, message: 'User is not the owner of resource!' } }

        //remove item from DB
        let res1 = await shopping_cart_model.remove_item(item_id);

        if (!res1.rowCount > 0) { return { status: false, message: 'Unable to remove item at this time, please try again later!' } }

        //send data response to user
        return { status: true, data: { message: 'Item successfully removed!' } }
    } catch (error) {
        console.error(error);
        error_logger('/api/user/cart/remove_item', error);
        return { status: false, status_code: 500, message: 'Internal Server Error' }
    }

}

module.exports.get_cart = async function (user_id) {
    try {
        //return if user does not exist
        if (!await user_exists(user_id)) { return { status: false, status_code: 406, message: 'User does not exist!' } }

        //cart user cart from DB
        let res0 = await shopping_cart_model.get_cart(user_id);

        //compute total amount for each item in the shopping cart
        res0.rows.forEach((element, i) => { res0.rows[i].total = (element.unit_price * element.quantity) + element.delivery_fee + element.pckg_fee; });
        return { status: true, data: res0.rows };

    } catch (error) {
        console.error(error);
        error_logger('/api/user/cart', error);
        return { status: false, status_code: 500, message: 'Internal Server Error' }
    }
}