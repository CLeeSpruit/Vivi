import { ViviElementParams } from '../decorators/element.decorator';
import { ComponentFactory } from '../factory/component-factory.class';
import { ModuleFactory } from '../factory/module-factory';
import { Component } from '../models/component.class';
import { MockComponent } from '../models/__mocks__/component.class';
import { MockService, MockWithPrereqService } from '../models/__mocks__/service.class';
import { loadViviServices } from '../services/load-services.static';

export interface ComponentMockOptions {
    hasTemplate?: boolean;
    template?: string;
    hasStyle?: boolean;
    style?: string;
    hasChild?: boolean;
    children?: Array<new (...args) => Component>;
    hasData?: boolean;
    data?: Object;
    hasElements?: boolean;
    elements?: Array<ViviElementParams>;
    doNotLoad?: boolean;
    doNotAppend?: boolean;
}

export class Mocker {
    module: ModuleFactory;
    rootComp: MockComponent;
    readonly defaultComponents = [
        { constructor: MockComponent, services: [ MockService] }
    ];
    readonly defaultTemplate = '<span class="test">Test</span>';
    readonly defaultStyle = '* { color: red }';
    readonly defaultData = { name: 'test' };
    readonly defaultElement = <ViviElementParams>{
        selector: 'span.test',
        propertyKey: 'test'
    };

    constructor() {
        this.module = new ModuleFactory({
            componentConstructors: this.defaultComponents,
            serviceConstructors: [
                { constructor: MockService },
                { constructor: MockWithPrereqService, prereqArr: [ MockService ]}
            ],
            rootComponent: MockComponent
        });

        this.rootComp = this.getFactory().get() as MockComponent;
    }

    getFactory(): ComponentFactory<MockComponent> {
        return <ComponentFactory<MockComponent>>this.module.getFactory(MockComponent);
    }

    createMock(options?: ComponentMockOptions): Component {
        const comp = this.getFactory().create(this.rootComp);

        if (!options) {
            comp.append();
            return comp;
        }

        if (options.template || options.hasTemplate) {
            comp.template = options.template ? options.template : this.defaultTemplate;
        }

        if (options.style || options.hasStyle) {
            comp.style = options.style ? options.style : this.defaultStyle;

            // Since this is set via the factory and is already in place,
            //     we're going to have to replace the existing version to "fake" the original
            const styleEl = document.createElement('style');
            styleEl.innerHTML = comp.style;
            document.head.appendChild(styleEl);
        }

        if (options.children || options.hasChild) {
            if (options.children) {
                options.children.forEach(child => {
                    comp.createChild(comp.element, child);
                });
            } else {
                comp.createChild(comp.element, MockComponent);
            }
        }

        if (options.data || options.hasData) {
            comp.data = options.data ? options.data : this.defaultData;
        }

        if (options.hasElements || options.elements) {
            if (options.elements) {
                Reflect.defineMetadata('ViviElement', options.elements, comp);
                options.elements.forEach(element => comp[element.handlerFnName] = () => { });
            } else {
                Reflect.defineMetadata('ViviElement', [this.defaultElement], comp);
                comp.template = this.defaultTemplate;
            }
        }

        if (!options.doNotAppend) {
            comp.append(null, null, options.doNotLoad);
        }
        return comp;
    }

    clearMocks() {
        const factory = this.getFactory();
        factory.destroyAll();
    }
}