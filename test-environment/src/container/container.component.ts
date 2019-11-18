import { Component, ViviElement } from '../../../dist';
import { ChildWithParamsComponent } from '../child-with-params/child-with-params.component';

export class ContainerComponent extends Component {
    @ViviElement({ selector: 'div.parent' }) private parent: HTMLDivElement;

    load() {
        this.createChild(this.parent, ChildWithParamsComponent, { name: 'Child With Params'})
    }
}