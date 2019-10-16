export class ParseEngine {
    private static attributeBlackList = [
        'v-class',
        'v-if',
        'v-innerhtml',
        'vif-innerhtml',
        'vif-class'
    ];

    static parseNode(node: Node, data: Object): Node {
        this.assignAttributes(node, data);
        return node;
    }

    private static assignAttributes(node: Node, data: Object) {
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
        this.attributeParse(node, data, 'v-class', (name, el, attr) => {
            const list = attr.split(' ');
            const parsed = list.filter(li => data.hasOwnProperty(li)).map(li => data[li]);
            el.classList.add(...parsed);
        });

        this.attributeParse(node, data, 'v-innerHTML', (name, el, attr) => {
            // Simple replace
            if (data.hasOwnProperty(attr)) {
                el.innerHTML = data[attr];
            }
        });

        this.attributeParse(node, data, 'v-if', (name, el, attr) => {
            if (!this.conditional(attr, data)) {
                el.remove();
            }
        });

        // Blacklisted vif
        this.attributeParseVif(node, data, 'vif-class', (name, el, attr) => {
            const list = attr.split(' ');
            const parsed = list.filter(li => data.hasOwnProperty(li)).map(li => data[li]);
            el.classList.add(...parsed);
        });

        this.attributeParseVif(node, data, 'vif-innerHTML', (name, el, attr) => {
            if (data.hasOwnProperty(attr)) {
                el.innerHTML = data[attr];
            } else {
                el.innerHTML = attr;
            }
        });
    }

    private static buildAttributeList(node: Node, attributes: Set<string> = new Set<string>()): Set<string> {
        const attr = (<HTMLElement>node).attributes;
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

    private static attributeParse(node: Node, data: Object, name: string, customParseFn?: (name: string, el: Element, attr: string) => void) {
        (<HTMLElement>node).querySelectorAll('[' + name + ']').forEach(el => {
            const attr = el.getAttribute(name);

            if (customParseFn) {
                customParseFn(name, el, attr);
            } else {
                // Simple replace
                const newAttribute = name.replace('v-', '');
                if (data.hasOwnProperty(attr)) {
                    el.setAttribute(newAttribute, data[attr]);
                }
            }
            // Rename to data to make parseable
            el.setAttribute('data-' + name, attr);
            el.removeAttribute(name);
        });
    }

    private static attributeParseVif(node: Node, data: Object, name: string, customParseFn?: (name: string, el: Element, attr: string) => void) {
        this.attributeParse(node, data, name, (attrName, el, attr) => {
            // Match against (conditional) ? trueResult : falseResult
            const match = attr.match(/(?<=\()(.*?)(?=\)\s*\?).*?(?<=\?)\s?(.*)/);
            if (match && match.length > 1) {
                const ternary = attr.match(/(?<=\()(.*?)(?=\)\s*\?).*?(?<=\?)\s?(.*?)\s?:\s?(.*)/);
                let result = null;
                if (ternary && ternary.length > 3) {
                    result = this.conditional(match[1], data) ? ternary[2] : ternary[3];
                } else {
                    result = this.conditional(match[1], data) ? match[2] || null : null
                }
                // Do not bother setting if there's no result
                if (result === null) return;
                if (customParseFn) {
                    customParseFn(name, el, result);
                } else {
                    let newAttribute = name.replace('vif-', '');
                    if (data.hasOwnProperty(result)) {
                        el.setAttribute(newAttribute, data[result]);
                    } else {
                        el.setAttribute(newAttribute, result);
                    }
                }
            }
        });
    }

    private static conditional(condition: string, data: Object): boolean {
        // Someone grab the holy water, we're going in
        try {
            return eval(condition);
        } catch (e) {
            try {
                // TODO: This can probably be evaluated as return !!data.condition
                return eval('data.' + condition);
            } catch (e) {
                console.log(e);
                return false;
            }
        }
    }
}