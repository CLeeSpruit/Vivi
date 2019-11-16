import { ParseElements } from './engine/elements';
import { ParseComponents } from './engine/components';
import { Service } from '../models/service.class';
import { FactoryService } from './factory.service';

export class ParseEngineService extends Service {
    private elements: ParseElements;
    private component: ParseComponents;

    constructor(private factoryService: FactoryService) {
        super();
        this.elements = new ParseElements();
        this.component = new ParseComponents(factoryService);
    }

    parseElements(el: HTMLElement, data: Object) {
        return this.elements.parseNode(el, data);
    }

    parseComponents(el: HTMLElement) {
        return this.component.parseComponents(el);
    }
}