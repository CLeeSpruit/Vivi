export class ParseEngineService extends Service {
    attributeBlackList = [
        'v-class',
        'v-each',
        'v-if',
        'v-innerhtml',
        'vif-innerhtml',
        'vif-class'
    ];

    constructor(factoryService) {
        super();
    }

    parse(node, data, comp) {
        // Get a list of all unique attributes
        const attributes = this.buildAttributeList(node);
        attributes.forEach(attr => {
            if (attr.startsWith('v-') && !this.attributeBlackList.find(bl => bl === attr)) {
                this.attributeParse(node, data, attr);
            }

            if (attr.startsWith('vif-') && !this.attributeBlackList.find(bl => bl === attr)) {
                this.attributeParseVif(node, data, attr);
            }
        });

        // Parse blacklist items

        // Classes
        this.attributeParse(node, data, 'v-class', (name, el, attr) => {
            const list = attr.split(' ');
            const parsed = list.map(li => {
                // Allow for data and non-data strings
                return this.applyWithContext(li, data);
            });
            el.classList.add(...parsed);
        });

        // InnerHTML (not actually an attribute, but a property)
        this.attributeParse(node, data, 'v-innerHTML', (name, el, attr) => {
            // Simple replace
            el.innerHTML = this.applyWithContext(attr, data);
        });


        // v-each
        this.attributeParse(node, data, 'v-each', (name, el, attr) => {
            // Parse v-each="this.children as SomeComponent"
            const match = attr.match(/(.*) as (\w*)/);
            if (match && match.length > 2) {
                const key = match[1];
                const componentName = match[2];
                const arr = this.applyWithContext(key, data);
                if (arr.forEach) {
                    arr.forEach((item, index) => {
                        const factory = this.factoryService.getFactoryByString(componentName);
                        factory.create(comp, item, { parentEl: el, doNotLoad: true });
                    });
                }
            }
        });

        // v-if
        this.attributeParse(node, data, 'v-if', (name, el, attr) => {
            if (!this.conditional(attr, data)) {
                el.remove();
            }
        });

        this.attributeParseVif(node, data, 'vif-class', (name, el, attr) => {
            const list = attr.split(' ');
            const parsed = list.map(li => {
                // Allow for data and non-data strings
                return this.applyWithContext(li, data);
            });
            el.classList.add(...parsed);
        });

        this.attributeParseVif(node, data, 'vif-innerHTML', (name, el, attr) => {
            el.innerHTML = this.applyWithContext(attr, data);
        });

        // Parsing Elements
        this.factoryService.module.getComponentRegistry().forEach(reg => {
            // Strip 'Component' off of name
            const name = GetElNameFromComponent(reg);
            const els = node.querySelectorAll(name);
            for (let i = 0; i < els.length; i++) {
                const el = els.item(i);
                if (!el.id) {
                    const factory = this.factoryService.getFactoryByString(reg);
                    factory.create(comp, (el).dataset, { parentEl: el.parentElement, replaceEl: el, doNotLoad: true});
                }
            }
        });
    }

    buildAttributeList(node, attributes = new Set()) {
        const attr = node.attributes;
        if (attr) {
            for (let i = 0; i < attr.length; i++) {
                attributes.add(attr.item(i).name);
            }
        }

        node.childNodes.forEach(child => {
            this.buildAttributeList(child, attributes);
        });

        return attributes;
    }

    attributeParse(el, data, name, customParseFn) {
        el.querySelectorAll('[' + name + ']').forEach(el => {
            const attr = el.getAttribute(name);

            if (customParseFn) {
                customParseFn(name, el, attr);
            } else {
                // Simple replace
                const newAttribute = name.replace('v-', '');
                el.setAttribute(newAttribute, this.applyWithContext(attr, data));
            }
            // Rename to data to make parseable
            el.setAttribute('data-' + name, attr);
            el.removeAttribute(name);
        });
    }

    attributeParseVif(node, data, name, customParseFn) {
        this.attributeParse(node, data, name, (attrName, el, attr) => {
            // Match against (conditional) ? trueResult : falseResult
            const match = attr.match(/(?<=\()(.*?)(?=\)\s*\?).*?(?<=\?)\s?(.*)/);
            if (match && match.length > 1) {
                const ternary = attr.match(/(?<=\()(.*?)(?=\)\s*\?).*?(?<=\?)\s?(.*?)\s?:\s?(.*)/);
                let result = null;
                if (ternary && ternary.length > 3) {
                    result = this.conditional(match[1], data) ? ternary[2] : ternary[3];
                } else {
                    result = this.conditional(match[1], data) ? match[2] || null : null;
                }
                // Do not bother setting if there's no result
                if (result === null) return;
                if (customParseFn) {
                    customParseFn(name, el, result);
                } else {
                    let newAttribute = name.replace('vif-', '');
                    el.setAttribute(newAttribute, this.applyWithContext(result, data));
                }
            }
        });
    }

    /* Generic fn */
    conditional(condition, context) {
        return function (condition) {
            // Someone grab the holy water, we're going in
            try {
                return eval(condition);
            } catch (e) {
                return false;
            }
        }.call(context, condition);
    }

    applyWithContext(value, context) {
        return function (value) {
            try {
                return eval(value);
            } catch (e) {
                return value;
            }
        }.call(context, value);
    }
}