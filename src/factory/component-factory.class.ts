import { ViviServiceFactory } from './';
import { Component, Service } from '../models';
import { ComponentIngredient } from '../models/component-ingredient.class';
import { ModuleFactory } from './module-factory';
import { ComponentParams } from '../models/component-params.class';

export class ViviComponentFactory<T> {
    private components: Map<string, Component> = new Map<string, Component>();
    private styleAppended: boolean;
    private recipe: Array<ComponentIngredient> = new Array<ComponentIngredient>();
    private recipeCreated: boolean;

    constructor(
        private constructor: new (...args) => Component,
        private services: Array<ViviServiceFactory<Service>> = new Array<ViviServiceFactory<Service>>()
    ) {
        //
    }

    create(data?: ComponentParams): Component {
        const component = new this.constructor(...this.services.map(service => service.get()));
        component.data = data || {};
 
        // Edit node, markup
        component.createNode();
        this.createStyle(component.style);
        this.createRecipe(<HTMLElement>component.parsedNode);
        component.createRecipe(this.recipe);

        this.components.set(component.id, component);
        return component;
    }

    private createStyle(style: string) {
        if (style && !this.styleAppended) {
            const styleEl = document.createElement('style');
            styleEl.innerHTML = style;
            document.head.appendChild(styleEl);
            this.styleAppended = true;
        }
    }

    private createRecipe(parentNode: HTMLElement) {
        if (!this.recipeCreated) {
            // Create recipe
            // Get registry and parse for any elements with custom tags names
            const moduleFactory: ModuleFactory = window.vivi;
            moduleFactory.getComponentRegistry().forEach(reg => {
                // Strip 'Component' off of name
                const name = reg.slice(0, reg.lastIndexOf('Component'));
                const els = parentNode.querySelectorAll(name.toLowerCase());
                for (let i = 0; i < els.length; i++) {
                    const el = els.item(i);
                    const factory = moduleFactory.getFactoryByString(reg) as ViviComponentFactory<Component>;
                    const ingredient = new ComponentIngredient(el as HTMLElement, factory);
                    this.recipe.push(ingredient);
                }
            });

            this.recipeCreated = true;
        }

    }

    destroy(id: string) {
        const component = this.get(id);
        // Run cleanup
        component.destroy();

        // Remove from the DOM
        const node = document.getElementById(id);
        node.remove();

        // Remove from the map
        this.components.delete(id);
    }

    get(id?: string): Component {
        if (id) {
            // TODO: Throw error if id doesn't exist
            return this.components.get(id);
        } else {
            // TODO: throw error (or warning) if this.components.length is 0
            // TODO: Should this grab the last component instead?
            return Array.from(this.components.values())[0] || null;
        }
    }
}