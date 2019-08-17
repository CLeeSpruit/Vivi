import { ViviComponentFactory } from '../';
import { Component } from '../../models';
import { ModuleFactory } from '../module-factory';

describe('Component Factory', () => {
    const basicMock = () => { return new ViviComponentFactory<MockComponent>(MockComponent, []) };
    const mockModule = () => {
        return new ModuleFactory({
            componentConstructors: [
                { constructor: MockComponent },
                { constructor: MockComponentWithChildComponent },
                { constructor: MockComponentWithInjectedStyleComponent }
            ]
        });
    };

    it('should init', () => {
        const mock = basicMock();

        expect(mock).toBeTruthy();
    });

    describe('create', () => {
        beforeEach(() => {
            window.vivi = mockModule();
        });

        it('should create a new component and return that component', () => {
            const mock = basicMock();

            const component = <MockComponent>mock.create();

            expect(component).toBeTruthy();
            expect(component instanceof MockComponent).toBeTruthy();
        });

        it('should append style to head if style is provided', () => {
            const stylishMock = new ViviComponentFactory<MockComponentWithInjectedStyleComponent>(MockComponentWithInjectedStyleComponent);
            const component = <MockComponent>stylishMock.create();

            expect(component.style).toEqual(mockStyle);
            const actual = document.getElementsByTagName('style');
            expect(actual.length).toEqual(1);
            expect(actual.item(0).innerHTML).toEqual(mockStyle);
        });

        it('should create a recipe if none was already created', () => {
            const mockWithChild = new ViviComponentFactory<MockComponentWithChildComponent>(MockComponentWithChildComponent);
            const component = <MockComponentWithChildComponent>mockWithChild.create();

            expect(component.recipe.length).toBeTruthy();
        });
    });

    describe('get', () => {
        it('get should return specific component', () => {
            const mock = basicMock();
            const componentA = <MockComponent>mock.create();
            const componentB = <MockComponent>mock.create();

            expect(mock.get(componentA.id)).toEqual(componentA);
            expect(mock.get(componentB.id)).toEqual(componentB);
        });

        it('get should return first component created if no id is provided', () => {
            const mock = basicMock();
            const componentA = <MockComponent>mock.create();
            const componentB = <MockComponent>mock.create();

            expect(mock.get()).toEqual(componentA);
        });
    });
});

class MockComponent extends Component {
    //
}

class MockComponentWithChildComponent extends Component {
    constructor() {
        super();
        this.template = mockTemplate;
    }
}

class MockComponentWithInjectedStyleComponent extends Component {
    constructor() {
        super();
        this.style = mockStyle;
    }
}

const mockStyle = 'a { color: red }';
const mockTemplate = '<Mock></Mock>';