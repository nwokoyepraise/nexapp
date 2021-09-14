module.exports = function (req, res) {
    let data = res.locals.data;
    //revert response to user
    switch (data.status) {
        case false:
            res.status(data.status_code).send({ status: false, message: data.message });
            break;

        case true:
            res.status(200).send({ status: true, data: data.data });
            break;
    }
}