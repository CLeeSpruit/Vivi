import { Service, Component } from '../models';
import { ModuleFactory } from '../factory/module-factory';

export class FactoryService extends Service {
    private module: ModuleFactory;

    constructor() {
        super();
        this.module = (<any>window).vivi;
    }

    getFactory(con: new (...args) => (Component | Service)) {
        return this.module.getFactory(con);
    }

    getFactoryByString(name: string) {
        return this.module.getFactoryByString(name);
    }
}