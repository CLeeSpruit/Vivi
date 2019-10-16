import { Component } from '../';
import { ModuleFactory } from '../../factory/module-factory';

describe('Class: Component', () => {
    const mockModule = () => {
        return new ModuleFactory({
            componentConstructors: [
                { constructor: MockComponent },
                { constructor: MockWithChildComponent }
            ]
        });
    };

    beforeEach(() => {
        window.vivi = mockModule();
    });

    afterEach(() => {
        // Clear the document
        for (let i = 0; i < document.body.children.length; i++) {
            document.body.children.item(i).remove();
        }
    });

    it('should init', () => {
        const component = new MockComponent();

        expect(component).toBeTruthy();
    });

    it('should append to document body if parent is not provided', () => {
        const component = new MockComponent();

        component.append();

        expect(component.parent).toEqual(document.body);
        expect(component.isLoaded).toBeTruthy();
        expect(component.isVisible).toBeTruthy();
        expect(component.element).toBeTruthy();
    });

    it('should append to parent', () => {
        const component = new MockComponent();
        const mockParent = document.createElement('parent');
        document.body.appendChild(mockParent);

        component.append(mockParent);

        expect(component.parent).toEqual(mockParent);
        const template = document.getElementById(component.id);
        expect(template.innerHTML).toEqual(component.template);
    });

    describe('Template Bindings', () => {
        it('should be able to parse class attr', () => {
            const mock = new MockComponent();
            mock.template = '<div v-class="test"></div>';
            const mockData = { test: 'cool-class' };
            mock.data = mockData;

            mock.append();

            expect(mock.element.getElementsByClassName(mockData.test).length).toEqual(1);
        });

        it('should be able to parse multiple class attr', () => {
            const mock = new MockComponent();
            mock.template = '<div v-class="test test2"></div>';
            const mockData = { test: 'cool-class', test2: 'really-cool-class' };
            mock.data = mockData;

            mock.append();

            expect(mock.element.getElementsByClassName(mockData.test).length).toEqual(1);
            expect(mock.element.getElementsByClassName(mockData.test2).length).toEqual(1);
        });

        it('should be able to append new classes to existing class list', () => {
            const mock = new MockComponent();
            mock.template = '<div class="mock" v-class="test"></div>';
            const mockData = { test: 'cool-class' };
            mock.data = mockData;

            mock.append();

            expect(mock.element.getElementsByClassName('mock').length).toEqual(1);
            expect(mock.element.getElementsByClassName(mockData.test).length).toEqual(1);
        });

        it('should not add classes that do not exist in the dataset', () => {
            const mock = new MockComponent();
            mock.template = '<div class="mock" v-class="test"></div>';
            const mockData = { someProp: 'some-prop' };
            mock.data = mockData;

            mock.append();

            expect(mock.element.getElementsByClassName('mock').length).toEqual(1);
            expect(mock.element.getElementsByClassName('test').length).toEqual(0);
            expect(mock.element.getElementsByClassName(mockData.someProp).length).toEqual(0);
        });

        it('should set a data attribute with the custom amount', () => {
            const mock = new MockComponent();
            mock.template = '<div v-class="test"></div>';

            mock.append();

            expect(mock.element.querySelectorAll('[data-v-class]').length).toEqual(1);
        });

        it('should remove the old attribute', () => {
            const mock = new MockComponent();
            mock.template = '<div v-class="test"></div>';

            mock.append();

            expect(mock.element.querySelectorAll('[v-class]').length).toEqual(0);
        });

        describe('vif', () => {
            it('should only render an attribute something if the result is true', () => {
                const mock = new MockComponent({ fluffy: 'bunny' });
                const trueText = 'bun bun bun';
                mock.template = '<span vif-innerHTML="(fluffy === \'bunny\') ? ' + trueText + '"></span>';

                mock.append();

                console.log(mock.data);
                expect(mock.data['fluffy']).toEqual('bunny');
                expect(mock.element.querySelector('span').innerHTML).toEqual(trueText);
            });


            it('should not render an attribute something if the result is false', () => {
                const mock = new MockComponent({ fluffy: 'puppy' });
                mock.template = '<span vif-innerHTML="(fluffy === \'bunny\') ? \'bow wow\'"></span>';

                mock.append();

                expect(mock.data['fluffy']).toEqual('puppy');
                expect(mock.element.querySelector('span').innerHTML).toBeFalsy();
            });

            it('should render only the true value if the result is true', () => {
                const mock = new MockComponent({ fluffy: 'puppy' });
                mock.template = '<span vif-innerHTML="(fluffy === \'bunny\') ? \'bun\' : \'bow\'"></span>';

                mock.append();

                expect(mock.data['fluffy']).toEqual('puppy');
                expect(mock.element.querySelector('span').innerHTML).toEqual('bow');
            });

            it('multiple vifs should only render the last truthy statement', () => {
                const mock = new MockComponent({ fluffy: 'puppy' });
                mock.template = '<span vif-innerHTML="(fluffy === \'bunny\') ? \'bun\' : \'bow\'" vif-innerHTML="(fluffy === \'puppy\') ? \'bow\'" vif-innerHTML="(fluffy) ? \'bow wow\'"></span>';

                mock.append();

                expect(mock.data['fluffy']).toEqual('puppy');
                expect(mock.element.querySelector('span').innerHTML).toEqual('bow wow');
            });
        });
    });

    describe('Parameter bindings', () => {

    });
});

class MockComponent extends Component {
    //
}

class MockWithChildComponent extends Component {
    constructor() {
        super();
        this.template = mockTemplate;
    }
}

const mockTemplate = '<Mock></Mock>';