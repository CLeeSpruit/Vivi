import { Component } from '../../../src/models/component.class';
import { ViviElement } from '../../../src/decorators/element.decorator';
import { ChildWithParamsComponent } from '../child-with-params/child-with-params.component';

export class ContainerComponent extends Component {
    @ViviElement({ selector: 'div.parent' }) private parent: HTMLDivElement;

    load() {
        this.createChild(this.parent, ChildWithParamsComponent, { name: 'Child With Params'});
    }
}