import { Service } from './';

export interface ViviComponentConstructor<T> {
    constructor: new (...args) => T;
    services?: Array<new (...args) => Service>;
}