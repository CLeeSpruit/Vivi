const path = require('path');

const config = {
    entry: {
        app: './src/index.ts',
    },
    target: 'node',
    node: {
        __dirname: true,
        __filename: true
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: [{
                loader: 'awesome-typescript-loader',
                options: {
                    transpileOnly: true,
                    context: __dirname,
                    configFile: 'tsconfig.json'
                }
            }],
            exclude: /node_modules/,
        }]
    },
    output: {
        filename: '[name].js'
    },
    mode: 'production',
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules'
        ],
        extensions: ['.ts', '.js', '.json']
    }
};

module.exports = [config];