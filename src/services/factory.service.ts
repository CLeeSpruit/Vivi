import { Component } from '../models/component.class';
import { Service } from '../models/service.class';
import { ModuleFactory } from '../factory/module-factory';
import { ComponentFactory, ServiceFactory } from '../factory';

export class FactoryService extends Service {
    module: ModuleFactory;

    constructor() {
        super();
        this.module = (<any>window).vivi;
    }

    getFactory<T extends Component = Component>(con: new (...args) => T): ComponentFactory<T>;
    getFactory<T extends Service = Service>(con: new (...args) => T): ServiceFactory<T>;
    getFactory(con: new (...args) => (Component | Service)): ComponentFactory | ServiceFactory {
        return this.module.getFactory(con);
    }
    
    getFactoryByString(name: string) {
        return this.module.getFactoryByString(name);
    }
}