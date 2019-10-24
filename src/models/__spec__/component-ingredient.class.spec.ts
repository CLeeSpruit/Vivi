import { Component } from '../';
import { ModuleFactory } from '../../factory/module-factory';
import { ComponentIngredient } from '../component-ingredient.class';
import { ViviComponentFactory } from '../../factory/component-factory.class';
import { MockComponent, MockWithTemplateComponent, MockWithChildrenComponent } from '../__mocks__/component.class';

describe('Class: Component Ingredient', () => {
    const mockModule = () => {
        return new ModuleFactory({
            componentConstructors: [
                { constructor: MockComponent }
            ]
        });
    };

    const mockIngredient = () => {
        return new ComponentIngredient( document.createElement('a'), new ViviComponentFactory(MockWithTemplateComponent));
    };

    const mockIngredientWithChildren = () => {
        return new ComponentIngredient( document.createElement('a'), new ViviComponentFactory(MockWithChildrenComponent));
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
        const actual = mockIngredient();

        expect(actual).toBeTruthy();
    });

    it('should create', () => {
        const actual = mockIngredient();
        expect(actual.component).toBeFalsy();

        actual.create();
        expect(actual.component).toBeTruthy();
    });

    it('should be able to pass in params to the factory', () => {
        const el = document.createElement('div');
        el.setAttribute('data-test', 'testing');

        const ingredient = new ComponentIngredient(el, new ViviComponentFactory(MockWithChildrenComponent));
        expect(ingredient.params).toBeTruthy();
        expect(ingredient.params.hasOwnProperty('test')).toBeTruthy();
        expect(ingredient.params['test']).toEqual('testing');
    });

    it('should be able to pass in params with camelCasing to the factory', () => {
        const el = document.createElement('div');
        el.setAttribute('data-test-test', 'testing');

        const ingredient = new ComponentIngredient(el, new ViviComponentFactory(MockWithChildrenComponent));
        expect(ingredient.params).toBeTruthy();
        expect(ingredient.params.hasOwnProperty('testTest')).toBeTruthy();
        expect(ingredient.params['testTest']).toEqual('testing');
    });

    it('load should append element', () => {
        const actual = mockIngredient();

        actual.create();
        actual.load(null);
    
        expect(actual.component.element).toBeTruthy();
        expect(actual.component.element.innerHTML).toEqual('test');
    });

    it('should loadAll of children components', () => {
        const ingredient = mockIngredientWithChildren();

        ingredient.create();
        ingredient.load(null);

        expect(ingredient.component.element).toBeTruthy();
        expect(ingredient.component.element.getElementsByTagName('mockcomponent')).toBeTruthy();
    });
});