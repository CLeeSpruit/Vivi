import { ParseEngineService } from '../parse-engine.service';
import { Mocker } from '../../meta/mocker';
import { attributeList } from '../../meta/attribute-list';

describe('Parse Elements', () => {
    const mock = new Mocker();
    const service = mock.module.get(ParseEngineService);

    afterEach(() => {
        mock.clearMocks();
    });

    it('should work', () => {
        const node = document.createElement('div');
        const comp = mock.createMock();
        service.parse(node, {}, comp);

        expect(node).toBeTruthy();
    });

    it('should work even if an element is just text', () => {
        const node = document.createElement('div');
        const comp = mock.createMock();
        node.textContent = 'test';

        service.parse(node, {}, comp);

        expect(node).toBeTruthy();
    });

    describe('conditional', () => {
        it('should eval as true for strings that are true', () => {
            expect(service.conditional('2 + 2 === 4', {})).toBeTruthy();
        });

        it('should eval as false for strings that are false', () => {
            expect(service.conditional('2 + 2 === 5', {})).toBeFalsy();
        });

        it('should eval as true for variables that are true', () => {
            const data = { bunny: true };
            const result = service.conditional('this.bunny', data);
            expect(result).toBeTruthy();
        });

        it('should eval as false for variables that are false', () => {
            const data = { bunny: false };
            expect(service.conditional('this.bunny', data)).toBeFalsy();
        });

        it('should eval as true for variables with comparisons that are true', () => {
            const data = { bunny: 'fluffy', puppy: 'fluffy' };
            expect(service.conditional('this.bunny === this.puppy', data)).toBeTruthy();
        });

        it('should eval as false for variables with comparisons that are false', () => {
            const data = { bunny: 'fluffy', puppy: 'cute' };
            expect(service.conditional('this.bunny === this.puppy', data)).toBeFalsy();
        });
    });

    const setup = (attr: string, value: string, data: any) => {
        const node = document.createElement('div');
        const child = document.createElement('div');
        const comp = mock.createMock();
        child.setAttribute(attr, value);
        node.append(child);
        service.parse(node, data, comp);

        return node;
    }

    const testAttribute = (attr: string) => {
        const normalAttrName = attr.replace('v-', '');
        describe(attr, () => {
            it('should evaluate data objects', () => {
                const data = { fluffy: 'bunny' };
                const value = 'this.fluffy';
                const comp = mock.createMock();
                const node = setup(attr, value, data);
                const actual = node.querySelector('div');
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
                const data = { fluffy: 'bunny' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy`;
                const node = setup(attr, value, data);

                const actual = node.querySelector('div');
                expect(actual.getAttribute(normalAttrName)).toEqual(data.fluffy);
            });

            it('should not render an attribute if the result is false', () => {
                const data = { fluffy: 'puppy' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy`;
                const node = setup(attr, value, data);

                const actual = node.querySelector('div');
                expect(actual.getAttribute(normalAttrName)).toBeFalsy();
            });

            it('should only render the true value if the result is true', () => {
                const data = { fluffy: 'bunny' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy : this.puppy`;
                const node = setup(attr, value, data);

                const actual = node.querySelector('div');
                expect(actual.getAttribute(normalAttrName)).toEqual(data.fluffy);
            });

            it('should only render the false value if the result is false', () => {
                const data = { fluffy: 'puppy', puppy: 'cute' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy : this.puppy`;
                const node = setup(attr, value, data);

                const actual = node.querySelector('div');
                expect(actual.getAttribute(normalAttrName)).toEqual(data.puppy);
            });

            it('should not render as true if the result is garbage', () => {
                const data = { fluffy: 'puppy' };
                const value = `(whatever) ? this.fluffly`;
                const node = setup(attr, value, data);

                const actual = node.querySelector('div');
                expect(actual.getAttribute(normalAttrName)).toBeFalsy();
            });

            it('should not render if the conditional is not formatted properly', () => {
                const data = { fluffy: 'bunny' };
                const value = `whatever ? this.fluffy`;
                const node = setup(attr, value, data);

                const actual = node.querySelector('div');
                expect(actual.getAttribute(normalAttrName)).toBeFalsy();
            });

            it('should not render if the result is missing', () => {
                const data = { fluffy: 'bunny' };
                const value = `(this.fluffy) ?`;
                const node = setup(attr, value, data);

                const actual = node.querySelector('div');
                expect(actual.getAttribute(normalAttrName)).toBeFalsy();
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
                const data = { fluffy: 'bunny', puppy: 'bow-wow' };
                const value = 'this.fluffy this.puppy';
                const node = setup('v-class', value, data);
                const actual = node.querySelector('div');

                expect(actual.classList.value).toEqual('bunny bow-wow');
            });
        });

        describe('v-innerHTML', () => {
            it('should add content to innerHTML', () => {
                const data = { fluffy: 'bunny' };
                const value = 'this.fluffy';
                const node = setup('v-innerHTML', value, data);
                const actual = node.querySelector('div');

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
                const data = { fluffy: 'bunny', puppy: 'bow' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy this.puppy : this.puppy`;
                const node = setup('vif-class', value, data);
                const actual = node.querySelector('div');

                expect(actual.classList.value).toEqual('bunny bow');
            });

            it('should add a list of classes from data and strings', () => {
                const data = { fluffy: 'bunny' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy pupper : this.puppy`;
                const node = setup('vif-class', value, data);

                const actual = node.querySelector('div');;
                expect(actual.classList.value).toEqual('bunny pupper');
            });
        });

        describe('vif-innerHTML', () => {
            it('should add content to innerHTML if true', () => {
                const data = { fluffy: 'bunny' };
                const value = `(this.fluffy === 'bunny') ? this.fluffy : bow`;
                const node = setup('vif-innerHTML', value, data);
                const actual = node.querySelector('div');

                expect(actual.innerHTML).toEqual('bunny');
            });
        });
    });

    describe('v-if nodes', () => {
        it('should render the node if value is truthy', () => {
            const data = { fluffy: 'bunny' };
            const value = `this.fluffy === 'bunny'`;
            const node = setup('v-if', value, data);
            const actual = node.querySelector('div');

            expect(actual).toBeTruthy();
        });

        it('should not render the node if value is falsy', () => {
            const data = { fluffy: 'puppy' };
            const value = `this.fluffy === 'bunny'`;
            const node = setup('v-if', value, data);
            const actual = node.querySelector('div');

            expect(actual).toBeFalsy();
        });
    });

    describe('v-each nodes', () => {
        it('should render a list of components and supply object as data', () => {
            const data = {
                puppies: [
                    { breed: 'Collie' },
                    { breed: 'Lab' },
                    { breed: 'Shiba' },
                    { breed: 'German Shepard' }
                ]
            };
            const value = `this.puppies as MockComponent`;
            const node = setup('v-each', value, data);
            const actual = node.querySelector('div');

            expect(actual.children.length).toEqual(data.puppies.length);
            const id = actual.children.item(0).id;
            const childComp = mock.getFactory().get(id);
            expect(childComp.data).toEqual(data.puppies[0]);
        });

        it('should not render if value does not match proper syntax', () => {
            const data = {
                puppies: [
                    { breed: 'Collie' },
                    { breed: 'Lab' },
                    { breed: 'Shiba' },
                    { breed: 'German Shepard' }
                ]
            };
            const value = `this.puppies`;
            const node = setup('v-each', value, data);
            const actual = node.querySelector('div');

            expect(actual.children.length).toEqual(0);
        });

        it('should not render if data is not array', () => {
            const data = {
                puppies: 'are cute'
            };
            const value = `this.puppies as MockComponent`;
            const node = setup('v-each', value, data);
            const actual = node.querySelector('div');

            expect(actual.children.length).toEqual(0);
        });
    });
});