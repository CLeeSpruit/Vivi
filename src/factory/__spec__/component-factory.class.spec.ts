import { ViviComponentFactory } from '../';
import { Component } from '../../models';

describe('Component Factory', () => {
    const basicMock = () => { return new ViviComponentFactory<MockComponent>(MockComponent, 'test', '', [], []) }

    it('should init', () => {
        const mock = basicMock();

        expect(mock).toBeTruthy();
    });

    it('should append style to head if style is provided', () => {
        const mockStyle = 'a { color: red }'
        const mock = new ViviComponentFactory<MockComponent>(MockComponent, 'test', mockStyle, [], []);

        const actual = document.getElementsByTagName('style');
        expect(actual.length).toEqual(1);
        expect(actual.item(0).innerHTML).toEqual(mockStyle);
    });

    describe('create', () => {
        it('should create a new component', () => {
            const mock = basicMock();

            const id = <string>mock.create();

            expect(id).toBeTruthy();
            expect(mock.get(id) instanceof MockComponent).toBeTruthy();
        });

        it('should create a new component and return that component', () => {
            const mock = basicMock();

            const component = <MockComponent>mock.create({ returnComponent: true });

            expect(component).toBeTruthy();
            expect(component instanceof MockComponent).toBeTruthy();
        });

        it('should create and append', () => {
            const mock = basicMock();
            const id = <string>mock.create({ append: true });

            const actual = document.getElementById(id);
            expect(actual).toBeTruthy();
        });

        it('should create and append to parent', () => {
            const mock = basicMock();
            const parent = document.createElement('parent');
            const id = <string>mock.create({ append: true, parent });

            const actual = parent.getElementsByTagName('mockcomponent');
            expect(actual.length).toBeTruthy();
        });

        it('should create children if they exist', () => {
            const child = new ViviComponentFactory<MockComponent>(MockComponent, 'child', '', [], []);
            const parent = new ViviComponentFactory<MockComponent>(MockComponent, 'parent', '', [], [child]);

            const parentComponent = <MockComponent>parent.create({ returnComponent: true });
            expect(parentComponent.children).toBeTruthy();
            expect(parentComponent.children[0] instanceof MockComponent).toBeTruthy();
        });
    });

    describe('get', () => {
        it('get should return specific component', () => {
            const mock = basicMock();
            const componentA = <MockComponent>mock.create({ returnComponent: true});
            const componentB = <MockComponent>mock.create({ returnComponent: true});

            expect(mock.get(componentA.id)).toEqual(componentA);
            expect(mock.get(componentB.id)).toEqual(componentB);
        });

        it('get should return first component created if no id is provided', () => {
            const mock = basicMock();
            const componentA = <MockComponent>mock.create({ returnComponent: true});
            const componentB = <MockComponent>mock.create({ returnComponent: true});

            expect(mock.get()).toEqual(componentA);
        });
    });
});

class MockComponent extends Component {
    //
}