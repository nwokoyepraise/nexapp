require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port_number = Number.parseInt(process.env.PORT_NUMBER);

//use and set express json limit
app.use(express.json({ limit: '20kb' }));


app.get('/', async function (req, res) {
    try {
        res.status(200).send('Welcome to Nexapp!')
    } catch (error) {
        console.error(error);
    }
});

app.get('/api/products/list', async function (req, res) {
    try {
        let body = req.body,
            user_id = body.user_id,
            tab = body.tab;



    } catch (error) {
        console.error(error);
    }
});

app.get('/api/products/product_details', async function (req, res) {
    try {

    } catch (error) {
        console.error(error);
    }
});


app.get('/api/user/cart', async function (req, res) {
    try {

    } catch (error) {
        console.error(error);
    }
});


server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`);
});