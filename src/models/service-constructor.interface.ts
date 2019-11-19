import { Service } from './service.class';

export interface ServiceConstructor<T extends Service = Service> {
    constructor: new (...args) => T;
    prereqArr?: Array<new (...args) => any>;
}
