import { ParseElements } from '../elements';
import { attributeList } from '../../../meta/attribute-list';

describe('Parse Elements', () => {
    let engine: ParseElements = new ParseElements();

    afterEach(() => {
        // Clear the document
        for (let i = 0; i < document.body.children.length; i++) {
            document.body.children.item(i).remove();
        }
    });

    it('should work', () => {
        const node = document.createElement('div');
        const actual = engine.parseNode(node, {});

        expect(actual).toBeTruthy();
    });

    it('should work even if an element is just text', () => {
        const node = document.createElement('div');
        node.textContent = 'test';

        const actual = engine.parseNode(node, {});

        expect(actual).toBeTruthy();
    });

    describe('conditional', () => {
        it('should eval as true for strings that are true', () => {
            expect(engine.conditional('2 + 2 === 4', {})).toBeTruthy();
        });

        it('should eval as false for strings that are false', () => {
            expect(engine.conditional('2 + 2 === 5', {})).toBeFalsy();
        });

        it('should eval as true for variables that are true', () => {
            const data = { bunny: true };
            const result = engine.conditional('this.bunny', data);
            expect(result).toBeTruthy();
        });

        it('should eval as false for variables that are false', () => {
            const data = { bunny: false };
            expect(engine.conditional('this.bunny', data)).toBeFalsy();
        });

        it('should eval as true for variables with comparisons that are true', () => {
            const data = { bunny: 'fluffy', puppy: 'fluffy' };
            expect(engine.conditional('this.bunny === this.puppy', data)).toBeTruthy();
        });

        it('should eval as false for variables with comparisons that are false', () => {
            const data = { bunny: 'fluffy', puppy: 'cute' };
            expect(engine.conditional('this.bunny === this.puppy', data)).toBeFalsy();
        });
    });

    const testAttribute = (attr: string) => {
        const normalAttrName = attr.replace('v-', '');
        describe(attr, () => {
            it('should evaluate data objects', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'bunny'};
                const value = 'this.fluffy';
                child.setAttribute(attr, 'this.fluffy');
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');
                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toEqual(data.fluffy);
                expect(actual.getAttribute('data-' + attr)).toEqual(value);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });
        });
    }

    const testAttributeIf = (attr: string) => {
        const normalAttrName = attr.replace('vif-', '');
        describe(attr, () => {
            it('should only render an attribute if the result is true', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'bunny' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toEqual(data.fluffy);
                expect(actual.getAttribute('data-' + attr)).toEqual(value);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });

            it('should not render an attribute if the result is false', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'puppy' };
                const trueValue = 'bow wow';
                const value = `(this.fluffy === 'bunny') ? this.fluffy`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toBeFalsy();
                expect(actual.getAttribute('data-' + attr)).toEqual(value);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });

            it('should only render the true value if the result is true', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'bunny' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy : this.puppy`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toEqual(data.fluffy);
                expect(actual.getAttribute('data-' + attr)).toEqual(value);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });

            it('should only render the false value if the result is false', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'puppy', puppy: 'cute' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy : this.puppy`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toEqual(data.puppy);
                expect(actual.getAttribute('data-' + attr)).toEqual(value);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });

            it('should not render as true if the result is garbage', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'puppy' };
                const value = `(whatever) ? this.fluffly`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toBeFalsy();
                expect(actual.getAttribute('data-' + attr)).toEqual(value);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });

            it('should not render if the conditional is not formatted properly', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'bunny' };
                const value = `whatever ? this.fluffy`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toBeFalsy();
                expect(actual.getAttribute('data-' + attr)).toEqual(value);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });

            it('should not render if the result is missing', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'bunny' };
                const value = `(this.fluffy) ?`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toBeFalsy();
                expect(actual.getAttribute('data-' + attr)).toEqual(value);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });
        });
    };

    // Any v- prop
    describe('v-* attributes', () => {
        attributeList.forEach(attr => {
            testAttribute('v-' + attr);
        });

        describe('v-class', () => {
            it('should add a list of classes', () => {
                const node = document.createElement('div');
                const child = document.createElement('span');
                const data = { fluffy: 'bunny', puppy: 'bow-wow' };
                const value = 'this.fluffy this.puppy';
                child.setAttribute('v-class', value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('span');

                expect(actual.classList.value).toEqual('bunny bow-wow');
            });
        });

        describe('v-innerHTML', () => {
            it('should add content to innerHTML', () => {
                const node = document.createElement('div');
                const child = document.createElement('span');
                const data = { fluffy: 'bunny' };
                const value = 'this.fluffy';
                child.setAttribute('v-innerHTML', value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('span');

                expect(actual.innerHTML).toEqual(data.fluffy);
            });
        });

    });

    // Vif
    describe('vif-* attributes', () => {
        attributeList.forEach(attr => {
            testAttributeIf('vif-' + attr);
        });

        describe('vif-class', () => {
            it('should add a list of classes if true', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'bunny', puppy: 'bow' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy this.puppy : this.puppy`;
                child.setAttribute('vif-class', value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.classList.value).toEqual('bunny bow');
                expect(actual.getAttribute('data-vif-class')).toEqual(value);
                expect(actual.getAttribute('vif-class')).toBeFalsy();
            });

            it('should add a list of classes from data and strings', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'bunny' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy pupper : this.puppy`;
                child.setAttribute('vif-class', value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.classList.value).toEqual('bunny pupper');
                expect(actual.getAttribute('data-vif-class')).toEqual(value);
                expect(actual.getAttribute('vif-class')).toBeFalsy();
            });
        });

        describe('vif-innerHTML', () => {
            it('should add content to innerHTML if true', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'bunny' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy : bow`;
                child.setAttribute('vif-innerHTML', value);
                node.append(child);
                const result = engine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.innerHTML).toEqual('bunny');
                expect(actual.getAttribute('data-vif-innerhtml')).toEqual(value);
                expect(actual.getAttribute('vif-innerhtml')).toBeFalsy();
            });
        });
    });

    describe('v-if nodes', () => {
        it('should render the node if value is truthy', () => {
            const parent = document.createElement('div');
            const node = document.createElement('span');
            const data = { fluffy: 'bunny' };
            const value = `this.fluffy === 'bunny'`;
            node.setAttribute('v-if', value);
            parent.append(node);
            const result = engine.parseNode(parent, data) as HTMLDivElement;
            const actual = result.querySelector('span');

            expect(actual).toBeTruthy();
        });

        it('should not render the node if value is falsy', () => {
            const parent = document.createElement('div');
            const node = document.createElement('span');
            const data = { fluffy: 'puppy' };
            const value = `this.fluffy === 'bunny'`;
            node.setAttribute('v-if', value);
            parent.append(node);
            const result = engine.parseNode(parent, data) as HTMLDivElement;
            const actual = result.querySelector('span');

            expect(actual).toBeFalsy();
        });
    });
});