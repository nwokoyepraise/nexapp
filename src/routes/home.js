const router = require('express').Router();

module.exports = router.get('', async function (req, res) {
    try {
        res.status(200).send('Welcome to Nexapp!');
    } catch (error) {
        console.error(error);
    }
});
