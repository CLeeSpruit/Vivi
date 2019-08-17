import * as nodeUuid from 'uuid';

import { ViviServiceFactory } from '../';
import { Component, Service } from '../../models';
import { MockComponent } from 'models/__mocks__/component.class';
import { ComponentParams } from 'models/component-params.class';

export class ViviComponentFactoryMock<T> {
    components: Map<string, Component> = new Map<string, Component>();

    constructor(
        private constructor: new (...args) => Component,
        private template: string,
        private style: string,
        private services: Array<ViviServiceFactory<Service>> = new Array<ViviServiceFactory<Service>>(),
        private children: Array<ViviComponentFactoryMock<Component>>
    ) { }

    create(data?: ComponentParams): Component {
        const uuid: string = nodeUuid();

        return new MockComponent();
    }

    append(id: string, parent?: Node): void {
        return;
    }

    hide(id: string): void {
        return;
    }

    destroy(id: string): void {
        return;
    }

    detach(id: string): void {
        return;
    }

    get(id?: string): Component {
        return null;
    }
}