import { EventRegistry, Stream } from '@cspruit/zephyr';
import { Module } from 'webpack';

/* Decorators */
export interface ViviElementParams {
    propertyKey?: string;
    selector: string;
    eventType?: string;
    handlerFnName?: string;
}
export declare function ViviElement(params: ViviElementParams): PropertyDecorator;
export declare function getElements(origin: Object): Array<ViviElementParams>;

/* Factory */
export declare class ComponentFactory<T extends Component = Component> {
    private services;
    private nodes?;
    private components;
    private counter;
    constructor(constructor: new (...args: any[]) => T, services?: Array<ServiceFactory>, nodes?: Nodes);
    createRoot(nodes: Nodes): void;
    create(parent: Component, data?: Object, options?: {
        parentEl?: HTMLElement;
        replaceEl?: HTMLElement;
        doNotLoad?: boolean;
        isRoot?: boolean;
    }): T;
    detach(id: string): NodeTree;
    destroy(id: string): void;
    destroyAll(): void;
    get(id?: string): T;
}

export interface ViviFactoryConstructor {
    serviceConstructors?: Array<typeof Service>;
    componentConstructors?: Array<typeof Component>;
    rootComponent?: new (...args: any[]) => Component;
    modules?: Array<ModuleFactory>
}

export interface ViviFactoryOptions {
    log: 'verbose' | 'info' | 'warn' | 'error' | 'none'
}

export declare class ModuleFactory {
    services: Map<string, ServiceFactory>;
    components: Map<string, ComponentFactory>;
    /**
	 * Creates an instance of ModuleFactory.
	 *
	 * @param {{componentConstructors: Array<typeof Component>, serviceConstructors: Array<typeof Service>, rootComponent: typeof Component}} [module]
	 * 	- Component constructors: Array of Components to be initialized
	 * 	- ServiceConstructors: Array of Services to be initialized
	 *  - RootComponent: Component to be set as root. Must be set in the component constructors as well.
	 * @param {{log: ['verbose', 'info', 'warn', 'error', 'none']}} [options] - Options passed into the module
	 *  - loglevel: Log level of application
	 *      - none - no logging
	 *      - error - output only errors
	 *      - warn - output only errors and warnings
	 *      - info - output errors, warnings, and other information
	 * 	    - verbose - all levels, including debug information
	 * @param {Array<Service | {key: string, override: Service}>} [overrides] - An array of services that inherit a baked in service or can also specify by {key: override}
	 *     - Ex: ```new ModuleFactory(null, null, [MyCoolEventService, MyCoolerLogger]);``` - _(Provided MyCoolEventService extends AppEvent and MyCoolerLogger extends Logger)_
	 *     - Ex: ```new ModuleFactory(null, null, [{key: 'AppEvent', override: SomeWeirdEventService}, {key: 'Logger', override: SuperCustomLoggerService }]);```
	 * @memberof ModuleFactory
	 */
    constructor(module: ViviFactoryConstructor, options?: ViviFactoryOptions, overrides?: Array<typeof Service | {[key: string]: typeof Service}>);
    get<T extends Component>(constuctor: new (...args: any[]) => T, id?: string): T;
    get<T extends Service>(constuctor: new (...args: any[]) => T, id?: string): T;
    getFactory<T extends Component = Component>(constructor: new (...args: any[]) => T): ComponentFactory<T>;
    getFactory<T extends Service = Service>(constructor: new (...args: any[]) => T): ServiceFactory<T>;
    getFactoryByString(name: string): ComponentFactory | ServiceFactory;
    getComponentRegistry(): Array<string>;
    start(): void;
}

export declare class ServiceFactory<T extends Service = Service> {
    prerequisites: Map<string, ServiceFactory>;
    instances: Map<string, T>;
    private counter;
    constructor(constructor: new (...args: any[]) => T, prerequisitesArr?: Array<ServiceFactory>);
    create(): T;
    get(id?: string): T;
    destroy(id: string): void;
    destroyAll(): void;
}

/* Helpers */
// Intentionally left out

/* Models */
export interface ComponentConstructor<T extends Component = Component> {
    constructor: new (...args: any[]) => T;
    services?: Array<new (...args: any[]) => Service>;
}

export declare abstract class Component extends Instance {
    id: string;
    componentName: string;
    template: string;
    style: string;
    data: Object;
    element: HTMLElement;
    parsedNode: HTMLElement;
    factoryService: FactoryService;
    appEvents: AppEvent;
    engine: Engine;
    nodes: Nodes;
    constructor();
    private getUnparsedNode;
    private createNodes;
    append(parentEl: HTMLElement, replaceEl?: HTMLElement): void;
    setFiles(): void;
    startLoad(): void;
    redraw(): void;
    load(): void;
    destroy(): void;
    listen(el: HTMLElement, eventType: string, cb: Function, options?: AddEventListenerOptions): void;
    createChild<T extends Component = Component>(parentEl: HTMLElement, component: new (...args) => T, data?: Object): T;
    /**
	 * Finds an element and binds an event to it, if provided.
	 *
	 * @param {string} selector - selector to call querySelector on
	 * @param {string} [eventType] - EventType to fire on
	 * @param {Function} [cb] - Callback to fire when event happens
	 * @returns {HTMLElement} - Element, if found
	 * @memberof Component
	*/
    bindElement(selector: string, eventType?: string, cb?: Function): HTMLElement;
}

export declare class NodeTree {
    component: Component;
    children: NodeTree[];
    constructor(comp: Component);
    addChild(comp: Component): NodeTree;
    removeChild(comp: Component): NodeTree;
    findChild(id: string, deepSearch?: boolean): NodeTree;
    findParentOf(id: string): NodeTree;
    hasChild(id: string): boolean;
    load(): void;
    destroy(): void;
}

export interface ServiceConstructor<T extends Service = Service> {
    constructor: new (...args: any[]) => T;
    prereqArr?: Array<new (...args: any[]) => any>;
}

export declare abstract class Service extends Instance {
    id: string;
    destroy(): void;
}

declare abstract class Instance {
    vivi: ModuleFactory;
    id: string;
    load(): void;
    setData(id: number, data?: Object): void;
    appListen(eventName: string, cb: Function): void;
    sendEvent(eventName: string, data?: Object): void;
    destroy(): void;
}

/* Services */
export declare class AppEvent extends Service {
    eventRegistry: EventRegistry;
    sendEvent(eventName: string, data?: any): void;
    createListener(eventName: string, callback: (event: any) => any): Stream;
}

export declare class FactoryService extends Service {
    module: ModuleFactory;
    constructor();
    getFactory<T extends Component = Component>(con: new (...args: any[]) => T): ComponentFactory<T>;
    getFactory<T extends Service = Service>(con: new (...args: any[]) => T): ServiceFactory<T>;
}

export declare class Nodes extends Service {
    applicationTree: NodeTree;
    setRoot(rootComponent: Component): void;
    getNode(comp: Component): NodeTree;
    removeComponent(comp: Component): void;
    detachComponent(comp: Component): NodeTree;
}

export declare class Engine extends Service {
    private factoryService;
    private readonly attributeBlackList;
    constructor(factoryService: FactoryService);
    parse(node: HTMLElement, data: Object, comp: Component): void;
    private buildAttributeList;
    private attributeParse;
    private attributeParseVif;
    conditional(condition: string, context: Object): boolean;
    private applyWithContext;
}