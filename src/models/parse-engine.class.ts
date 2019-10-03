export class ParseEngine {
    private static attributeBlackList = ['v-class'];

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
        });

        // Parse blacklist items
        this.attributeParse(node, data, 'v-class', (name, el, attr) => {
            const list = attr.split(' ');
            const parsed = list.filter(li => data.hasOwnProperty(li)).map(li => data[li]);
            el.classList.add(...parsed);
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
                // Do a simple replace
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

}