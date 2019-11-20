import { ModuleFactory } from '../../src/factory/module-factory';
import { ContainerComponent } from './container/container.component';
import { ChildComponent } from './child/child.component';
import { ChildWithParamsComponent } from './child-with-params/child-with-params.component';

export const createModule = () => {
    return new ModuleFactory({
        componentConstructors: [
            { constructor: ContainerComponent },
            { constructor: ChildComponent },
            { constructor: ChildWithParamsComponent }
        ],
        rootComponent: ContainerComponent
    });
}

const vivi = createModule();