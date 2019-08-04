
### Webpack Requirements
* Vivi uses the alias feature of Webpack's module resolution to know where a component's template and style files are located. This will need to be defined in the webpack.config file.

```javascript
    module.exports = [{
        resolve: {
            alias: {
                vivi_application: path.resolve(__dirname, 'path/to/application')
            }
        }
    }]
```