const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/script/a.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    }
}