import { Component } from '../../models/component.class';
import { FactoryService } from '../factory.service';
import { ViviComponentFactory } from '../../factory';
import { GetElNameFromComponent } from '../../helpers/get-el-name-from-component';

export class ParseComponents {
    constructor(private factoryService: FactoryService) {
        //   
    }

    parseComponents(el: HTMLElement): Array<Component> {
        return this.createRecipe(el);
    }

    /*
        @todo Implement Component Redraw
    */
    // parseComponentRedraw(el: HTMLElement, oldChildren: Array<Component>): Array<Component> {
    //     // Find arr of parents
    //     return oldChildren;
    // }

    private createRecipe(node: HTMLElement): Array<Component> {
        const recipe = new Array<Component>();
        this.factoryService.module.getComponentRegistry().forEach(reg => {
            // Strip 'Component' off of name
            const name = GetElNameFromComponent(reg);
            const els = node.querySelectorAll(name);
            for (let i = 0; i < els.length; i++) {
                const el = els.item(i) as HTMLElement;
                if (!el.id) {
                    const factory = this.factoryService.getFactoryByString(reg) as ViviComponentFactory<Component>;
                    const child = factory.create((el).dataset);
                    child.append(el.parentElement, el, true);
                    recipe.push(child);
                }
            }
        });

        return recipe;
    }
};