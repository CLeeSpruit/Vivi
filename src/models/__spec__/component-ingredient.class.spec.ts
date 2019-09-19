import { Component } from '../';
import { ModuleFactory } from '../../factory/module-factory';
import { ComponentIngredient } from '../component-ingredient.class';
import { ViviComponentFactory } from '../../factory/component-factory.class';

describe('Class: Component Ingredient', () => {
    const mockModule = () => {
        return new ModuleFactory({
            componentConstructors: [
                { constructor: MockComponent }
            ]
        });
    };

    const mockIngredient = () => {
        return new ComponentIngredient( document.createElement('a'), new ViviComponentFactory(MockComponent));
    }

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

    it('create should append element', () => {
        const actual = mockIngredient();

        actual.create();
    
        expect(actual.component.element).toBeTruthy();
        expect(actual.component.element.innerHTML).toEqual(mockTemplate);
    });
});


class MockComponent extends Component {
    constructor() {
        super();
        this.template = mockTemplate;
    }
}

const mockTemplate = 'test';