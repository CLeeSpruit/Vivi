import { Component } from './component.class';
import { Service } from '@system/service/service.class';

export interface ViviComponentConstructor<T> {
    constructor: new (...args) => T;
    services?: Array<new (...args) => Service>;
    children?: Array<new (...args) => Component>;
}