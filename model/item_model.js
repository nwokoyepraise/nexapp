module.exports = class Item {
    constructor(avail_quantity, avail_sizes, avail_colors, delivery_methods) {
        this.avail_quantity = avail_quantity;
        this.avail_sizes = avail_sizes;
        this.avail_colors = avail_colors;
        this.delivery_methods = delivery_methods;
    }
    isValid(quantity, product_size, product_color, delivery_method) {
        if (!this.avail_quantity > quantity) {return {valid: false, field: 'quantity'} }
        else if (!this.avail_sizes.includes(product_size)) {return {valid: false, field: 'size'} }
        else if (!this.avail_colors.includes(product_color)) {return {valid: false, field: 'color'} }
        else if (!this.delivery_methods.includes(delivery_method)) {return {valid: false, field: 'delivery method'} }
        return {valid: true};
    }
}