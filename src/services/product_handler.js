const product_model = require('../models/product_model');
const error_logger = require('../utils/error_logger');

module.exports.product_details = async function (product_id) {
    try {
        let res0 = await product_model.product_details(product_id);
        if (!res0.rowCount > 0) { return { status: false, status_code: 404, message: 'Item does not exist!' } }
        return { status: true, data: res0.rows[0] }
    } catch (error) {
        console.error(error);
        error_logger('/api/products/product_details', error);
        return { status: false, status_code: 500, message: 'Internal Server Error' }
    }

}

module.exports.product_list = async function (query) {
    try {
        let tab = query.tab,
            user_id = query.user_id,
            lt = query.lt,
            forward = query.forward;
        //check if tab field is valid. If not valid return appropraitely
        if (!tab || (tab != 'FOR YOU' && tab != 'TRENDING' && tab != 'CATEGORIES' && tab != 'EARLY ACCESS' && tab != 'SPECIALS')) {
            return { status: false, status_code: 400, message: 'Null or invalid tab field!' }
        }
        //multiplying timestamp value by 1000 in other to be in miliseconds instead of seconds as required by JS Date Object otherwise set field as null if not exist
        lt = (lt) ? new Date(query.lt * 1000) : null;
        forward = (forward) ? forward === 'true' : null;

        //get data from product list model (DB)
        let res0 = await product_model.product_list(lt, tab, forward);

        return { status: true, data: res0.rows }
    } catch (error) {
        console.error(error);
        error_logger('/api/products/product_details', error);
        return { status: false, status_code: 500, message: 'Internal Server Error' }
    }
}