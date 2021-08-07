const pool = require("../config/postgres_config");

module.exports = function (user_id) {
    try {
        async () => {
            let res0 = await pool.query('SELECT user_id FROM user_profile WHERE user_id = $1', [user_id]);
            if (!res0.rowCount > 0) {
                return false;
            }
            return true;
        }
    } catch (error) {
        console.error(error)
    }
}