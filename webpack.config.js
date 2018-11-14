module.exports = {
    output: {
        filename: 'bundle.js',
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|build)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env'],
                }
            }
        }]
    }
};
