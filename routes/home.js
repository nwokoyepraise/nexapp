

module.exports = function (app) {
    app.get('/', async function (req, res) {
        try {
            res.status(200).send('Welcome to Nexapp!')
        } catch (error) {
            console.error(error);
        }
    });
}