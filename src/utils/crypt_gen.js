const cryptoRandomString = require('crypto-random-string');

module.exports.gen = function (length) {
    const mChar = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return cryptoRandomString({ length: length, characters: mChar });
}