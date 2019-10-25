import { ComponentParams } from '../component-params.class';
import { Component } from '../component.class';
import { ModuleFactory } from '../../factory';
import { MockComponentParams } from '../__mocks__/component-params.class';
import { MockWithParamsComponent } from '../__mocks__/component.class';

describe('Class: Component Params', () => {
    beforeEach(() => {
        const vivi = new ModuleFactory({
            componentConstructors: [{ constructor: MockWithParamsComponent }]
        });
    });
    it('should init', () => {
        const params = new MockComponentParams(<MockComponentParams>{ name: 'test' });
        const component = new MockWithParamsComponent(params);

        expect(component).toBeTruthy();
        expect(component.params).toBeTruthy();
        expect(component.params.name).toEqual(params.name);
    });

    it('component should still init without params', () => {
        const component = new MockWithParamsComponent();

        expect(component).toBeTruthy();
        expect(component.params).toEqual({});
    });

    it('params should still init without params', () => {
        const params = new MockComponentParams(null);
        const component = new MockWithParamsComponent(params);

        expect(component).toBeTruthy();
        expect(component.params).toBeTruthy();
        expect(component.params).toEqual({});
    });
});
