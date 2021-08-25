require('dotenv').config()
const flutterwave = require('flutterwave-node-v3');
const PUBLIC_KEY = process.env.FLUTTER_PUB_KEY;
const SECRET_KEY = process.env.FLUTTER_SECRET_KEY;



module.exports =  new flutterwave(PUBLIC_KEY, SECRET_KEY);
