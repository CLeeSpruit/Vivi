import { ModuleFactory } from '../factory/module-factory';

export class Mocker {
    module;
    rootComp;
    defaultComponents = [
        { constructor: MockComponent, services: [ MockService] }
    ];
    defaultTemplate = '<span class="test">Test</span>';
    defaultStyle = '* { color: red }';
    defaultData = { name: 'test' };
    defaultElement =  {
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

        this.rootComp = this.getFactory().get();
    }

    getFactory() {
        return this.module.getFactory(MockComponent);
    }

    createMock(options) {
        const comp = this.getFactory().create(this.rootComp);

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
            comp.append(this.rootComp.element, null);

            if(!options.doNotLoad) {
                // Get node
                const nodeTree = this.module.get(NodeTreeService);
                nodeTree.loadComponent(comp);
            }
        }

        // Application needs to be loaded before children can be added
        if (options.children || options.hasChild) {
            if (options.children) {
                options.children.forEach(child => {
                    comp.createChild(comp.element, child);
                });
            } else {
                comp.createChild(comp.element, MockComponent);
            }
        }

        return comp;
    }

    clearMocks() {
        const factory = this.getFactory();
        factory.destroyAll();
    }
}