const path = require('path');

const config = {
    entry: {
        vivi: './src/index.ts',
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
        filename: 'vivi.js',
        library: 'vivi',
        libraryTarget: 'umd'
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