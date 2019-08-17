import { ComponentParams } from './component-params.class';
import { ViviComponentFactory } from 'factory';
import { Component } from './component.class';

export class ComponentIngredient {
    params: ComponentParams;
    component: Component;

    constructor(
        private element: HTMLElement,
        private factory: ViviComponentFactory<Component>
    ) {
        // Get data from element
        this.params = element.dataset;
    }

    create() {
        this.component = this.factory.create(this.params);
        this.component.append(this.element);
    }
}