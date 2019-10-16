import { ParseEngine } from '../parse-engine.class';
import { attributeList } from './attribute-list';

describe('Parse Engine', () => {
    it('should work', () => {
        const node = document.createElement('div');
        const actual = ParseEngine.parseNode(node, {});

        expect(actual).toBeTruthy();
    });

    const testAttribute = (attr: string) => {
        const normalAttrName = attr.replace('v-', '');
        describe(attr, () => {
            it('should evaluate data objects', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const ogValue = 'fluffy';
                const value = 'bunny';
                child.setAttribute(attr, ogValue);
                node.append(child);
                const result = ParseEngine.parseNode(node, { fluffy: value }) as HTMLDivElement;
                const actual = result.querySelector('div');
                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toEqual(value);
                expect(actual.getAttribute('data-' + attr)).toEqual(ogValue);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });
            it('should not evaluate items that do not belong in the data object', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const value = 'fluffy';
                child.setAttribute(attr, value);
                node.append(child);
                const result = ParseEngine.parseNode(node, {}) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toBeFalsy();
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
                const trueValue = 'bun bun bun';
                const value = `(fluffy === 'bunny') ? ${trueValue}`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = ParseEngine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toEqual(trueValue);
                expect(actual.getAttribute('data-' + attr)).toEqual(value);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });

            it('should not render an attribute if the result is false', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'puppy' };
                const trueValue = 'bow wow';
                const value = `(fluffy === 'bunny') ? ${trueValue}`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = ParseEngine.parseNode(node, data) as HTMLDivElement;
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
                const trueValue = 'bun bun bun';
                const falseValue = 'bow wow';
                const value = `(fluffy === 'bunny') ? ${trueValue} : ${falseValue}`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = ParseEngine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toEqual(trueValue);
                expect(actual.getAttribute('data-' + attr)).toEqual(value);
                expect(actual.getAttribute(attr)).toBeFalsy();
            });

            it('should only render the false value if the result is false', () => {
                const node = document.createElement('div');
                const child = document.createElement('div');
                const data = { fluffy: 'puppy' };
                const trueValue = 'bun bun bun';
                const falseValue = 'bow wow';
                const value = `(fluffy === 'bunny') ? ${trueValue} : ${falseValue}`;
                child.setAttribute(attr, value);
                node.append(child);
                const result = ParseEngine.parseNode(node, data) as HTMLDivElement;
                const actual = result.querySelector('div');

                expect(actual).toBeTruthy();
                expect(actual.getAttribute(normalAttrName)).toEqual(falseValue);
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
    });

    // Vif
    describe('vif-* attributes', () => {
        attributeList.forEach(attr => {
            testAttributeIf('vif-' + attr);
        });
    });
});
