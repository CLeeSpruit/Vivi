import * as nodeUuid from 'uuid';

import { ViviServiceFactory } from '../';
import { Component, Service } from '../../models';
import { MockComponent } from 'models/__mocks__/component.class';

export class ViviComponentFactoryMock<T> {
    components: Map<string, Component> = new Map<string, Component>();

    constructor(
        private constructor: new (...args) => Component,
        private template: string,
        private style: string,
        private services: Array<ViviServiceFactory<Service>> = new Array<ViviServiceFactory<Service>>(),
        private children: Array<ViviComponentFactoryMock<Component>>
    ) { }

    create(options?: { append?: boolean, parent?: Node, returnComponent?: boolean }): Component | string {
        const uuid: string = nodeUuid();

        if (options && options.returnComponent) {
            return new MockComponent();
        } else {
            return uuid;
        }
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