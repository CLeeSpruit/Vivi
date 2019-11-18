import { Service } from './service.class';
import { Component } from './component.class';

export interface ComponentConstructor<T extends Component = Component> {
    constructor: new (...args) => T;
    services?: Array<new (...args) => Service>;
}