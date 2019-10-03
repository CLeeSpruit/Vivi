
### Webpack Requirements
* Vivi uses the alias feature of Webpack's module resolution to know where a component's template and style files are located. This will need to be defined in the webpack.config file.

```javascript
    module.exports = [{
        resolve: {
            alias: {
                vivi_application: path.resolve(__dirname, 'path/to/application')
            }
        }
    }];
```

### Templating
#### Attributes
* Adding a variable to a component's data object will expose that object to the template
* Appending 'v-' in front of a component will replace the value with whatever is in that component's data object

Template:
```html
    <span v-innerHtml="fluffy"></span>
```
In the class:
```javascript
    data: {
        fluffy: 'bunny'
    }
```
Compiles to:
```html
    <span innerHtml="bunny" data-innerHtml="fluffy"></span>
```

#### If blocks
* Blocks of HTML code can be optional based off of a condition

Template:
```html
    <div v-if="fluffy === 'bunny'"><p>This text only shows up if bunnies are fluffy.</p></div>
```

* Attributes can also have if statements by appending vif- to the front of the attribute.
* vif supports ternary statements
* You can also have multiple if statements in the same block for the same attribute.
    * Note that only the last truthy statement will be rendered in the output

Template:
```html
    <span
        vif-innerHTML="(fluffy === 'bunny') ? 'bun bun bun'"
        vif-innerHTML="(fluffy === 'puppy') ? 'bow wow'"
    ></span>
    <span
        vif-innerHTML="(fluffy === 'bunny') ? 'bun' : 'bow'"
    ></span>
```