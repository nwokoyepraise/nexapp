const fs = require('fs/promises');

module.exports = async (route, error) => {
    try {
        fs.appendFile('error_log.txt', `Route: ${route}\nTimestamp: ${new Date()}\nError: ${error.stack}\n\n\n`)
    } catch (error) {
        console.error(error);
    }
}