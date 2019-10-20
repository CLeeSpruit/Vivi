import { ComponentParams } from '../component-params.class';
import { Component } from '../component.class';

describe('Class: Component Params', () => {
    it('should init', () => {
        const params = new MockComponentParams(<MockComponentParams>{ name: 'test' });
        const component = new MockComponent(params);

        expect(component).toBeTruthy();
        expect(component.params).toBeTruthy();
        expect(component.params.name).toEqual(params.name);
    });

    it('component should still init without params', () => {
        const component = new MockComponent();

        expect(component).toBeTruthy();
        expect(component.params).toEqual({});
    });

    it('params should still init without params', () => {
        const params = new MockComponentParams(null);
        const component = new MockComponent(params);

        expect(component).toBeTruthy();
        expect(component.params).toBeTruthy();
        expect(component.params).toEqual({});
    });
});

class MockComponentParams extends ComponentParams {
    name: string;
}

class MockComponent extends Component {
    params: MockComponentParams;
}