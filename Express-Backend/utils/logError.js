// utils/errorLogger.js
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'error.log');

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

const logError = (source, error, context = {}) => {
    const timestamp = new Date().toISOString();
    const errorMessage = `\n[${timestamp}] [${source}]\nMessage: ${error.message}\nStack: ${error.stack}\nContext: ${JSON.stringify(context, null, 2)}\n`;

    // Write to log file
    fs.appendFileSync(LOG_FILE, errorMessage);

    // Console colored logging
    console.log(chalk.red.bold(`\n[${timestamp}] ERROR in ${source}`));
    console.log(chalk.red(error.message));
    if (Object.keys(context).length) {
        console.log(chalk.yellowBright('Context:'), context);
    }
};

module.exports = logError;