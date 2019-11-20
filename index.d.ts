import {  BehaviorSubject, OperatorFunction, Observable } from 'rxjs';

/* Decorators */
export interface ViviElementParams {
    propertyKey?: string;
    selector: string;
    eventType?: string;
    handlerFnName?: string;
}
export declare function ViviElement(params: ViviElementParams): PropertyDecorator;
export declare function getElements(origin: Object): Array<ViviElementParams>;

/* Events */
export interface ApplicationEvent {
    data: any;
    closeOnComplete: boolean;
}

export declare class ApplicationListener {
    private eventName;
    private subscription;
    constructor(eventName: string, callback: (event: ApplicationEvent) => any, obs: Observable<ApplicationEvent>, options?: {
        emitEvent: boolean;
    });
    remove(): void;
    close(): void;
}

export declare class EventTypes {
    static enter: string;
    static click: string;
    static keypress: string;
    static change: string;
    static input: string;
    static scroll: string;
    static scrollDown: string;
    static scrollUp: string;
    static wheel: string;
}

export declare class Listener {
    private type;
    private element;
    private callback;
    private options?;
    constructor(type: string, element: HTMLElement, callback: (event: Event | FocusEvent | MouseEvent | KeyboardEvent) => any, options?: boolean | AddEventListenerOptions);
    add(): void;
    remove(): void;
}

/* Factory */
export declare class ComponentFactory<T extends Component = Component> {
    private services;
    private nodeTreeService?;
    private components;
    private counter;
    constructor(constructor: new (...args: any[]) => T, services?: Array<ServiceFactory>, nodeTreeService?: NodeTreeService);
    createRoot(nodeTreeService: NodeTreeService): void;
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
    serviceConstructors?: Array<ServiceConstructor>;
    componentConstructors: Array<ComponentConstructor>;
    rootComponent: new (...args: any[]) => Component;
}
export declare class ModuleFactory {
    services: Map<string, ServiceFactory>;
    components: Map<string, ComponentFactory>;
    constructor(module: ViviFactoryConstructor);
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

export declare abstract class Component {
    id: string;
    componentName: string;
    template: string;
    style: string;
    data: Object;
    element: HTMLElement;
    parsedNode: HTMLElement;
    listeners: Array<Listener | ApplicationListener>;
    factoryService: FactoryService;
    appEvents: ApplicationEventService;
    engine: ParseEngineService;
    nodeTreeService: NodeTreeService;
    constructor();
    setData(id: number, data?: Object): void;
    private getUnparsedNode;
    private createNodes;
    append(parentEl: HTMLElement, replaceEl?: HTMLElement): void;
    startLoad(): void;
    redraw(): void;
    detach(): void;
    load(): void;
    destroy(): void;
    listen(el: HTMLElement, eventType: string, cb: Function, options?: AddEventListenerOptions): void;
    appListen(eventName: string, cb: Function, options?: ListenerOptions): void;
    createChild(parentEl: HTMLElement, component: new (...args: any[]) => Component, data?: Object): void;
}

export declare class NodeTree {
    component: Component;
    children: NodeTree[];
    constructor(comp: Component);
    addChild(comp: Component): NodeTree;
    removeChild(comp: Component): NodeTree;
    findChild(id: string, deepSearch?: boolean, returnNode?: boolean): Component | NodeTree;
    findParentOf(id: string): NodeTree;
    hasChild(id: string): boolean;
    load(): void;
    destroy(): void;
}

export interface ServiceConstructor<T extends Service = Service> {
    constructor: new (...args: any[]) => T;
    prereqArr?: Array<new (...args: any[]) => any>;
}

export declare abstract class Service {
    id: string;
    listeners: Array<Listener | ApplicationListener>;
    setData(id: number): void;
    destroy(): void;
}

/* Services */
export interface ListenerOptions {
    getCurrentValue?: boolean;
    pipe?: OperatorFunction<ApplicationEvent, ApplicationEvent>;
}

export declare class ApplicationEventService extends Service {
    eventRegistry: Map<string, BehaviorSubject<ApplicationEvent>>;
    sendEvent(eventName: string, data?: any, closeAfterEvent?: boolean): void;
    createListener(eventName: string, callback: (event: ApplicationEvent | any) => any, options?: ListenerOptions): ApplicationListener;
}

export declare class FactoryService extends Service {
    module: ModuleFactory;
    constructor();
    getFactory<T extends Component = Component>(con: new (...args: any[]) => T): ComponentFactory<T>;
    getFactory<T extends Service = Service>(con: new (...args: any[]) => T): ServiceFactory<T>;
    getFactoryByString(name: string): ServiceFactory<Service> | ComponentFactory<Component>;
}

// export declare const loadViviServices: Array<ServiceConstructor>;

export declare class NodeTreeService extends Service {
    applicationTree: NodeTree;
    setRoot(rootComponent: Component): void;
    getNode(comp: Component): NodeTree;
    addNodeToComponent(parentComp: Component, childNode: NodeTree): void;
    loadComponent(comp: Component): void;
    addComponent(parentComp: Component, childComp: Component): NodeTree;
    removeComponent(comp: Component): void;
    detachComponent(comp: Component): NodeTree;
}

export declare class ParseEngineService extends Service {
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