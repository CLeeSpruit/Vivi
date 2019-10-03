export class ParseEngine {
    private static attributeBlackList = [
        'v-class',
        'v-if'
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

            if (attr.startsWith('vif-')) {
                const ogAttr = attr.replace('vif-', '');
                this.attributeParse(node, data, ogAttr, (name, el, attr) => {
                    // Match against (conditional) ? trueResult : falseResult
                    const match = attr.match(/(?<=\()(.*?)(?=\)\s*\?).*?(?<=\?)\s?(.*)/);
                    if (match && match.length > 1) {
                        const ternary = attr.match(/(?<=\()(.*?)(?=\)\s*\?).*?(?<=\?)\s?(.*?)\s?:\s?(.*)/);
                        let result = match[2] || '';
                        if (ternary && ternary.length > 3) {
                            result = this.conditional(match[1]) ? ternary[2] : ternary[3];   
                        }
                        if (data.hasOwnProperty(result)) {
                            el.setAttribute(ogAttr, data[attr]);
                        } else {
                            el.setAttribute(ogAttr, result);
                        }
                    }
                });
            }
        });

        // Parse blacklist items
        this.attributeParse(node, data, 'v-class', (name, el, attr) => {
            const list = attr.split(' ');
            const parsed = list.filter(li => data.hasOwnProperty(li)).map(li => data[li]);
            el.classList.add(...parsed);
        });

        this.attributeParse(node, data, 'v-if', (name, el, attr) => {
            // If the condition is not true, remove entire node
            if (!this.conditional(attr)) {
                el.remove();
            } 
        });
    }

    private static buildAttributeList(node: Node, attributes: Set<string> = new Set<string>()): Set<string> {
        const attr = (<HTMLElement>node).attributes;
        if (attr) {
            for(let i = 0; i < attr.length; i++) {
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
                const regex = name.match(/^v-(.*)/);
                if (data.hasOwnProperty(attr) && regex.length > 1) {
                    const nonVAttr = regex[1];
                    el.setAttribute(nonVAttr, data[attr]);
                }
            }
            // Rename to data to make parseable
            el.setAttribute('data-' + name, attr);
            el.removeAttribute(name);
        });
    }

    private static conditional(condition: string): boolean {
        // Someone grab the holy water, we're going in
        return eval(condition);
    }
}