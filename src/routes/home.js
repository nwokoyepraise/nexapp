const router = require('express').Router();

module.exports = router.get('', async function (req, res) {
    try {
        res.status(200).json({ status: true, data: { message: 'server active!' }});
    } catch (error) {
        console.error(error);
    }
});
