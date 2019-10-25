import { Component } from '../component.class';
import { MockComponentParams } from './component-params.class';
import { ViviElement } from '../../decorators/element.decorator';
import { EventTypes } from '../../events';

export class MockComponent extends Component {
    constructor() {
        super();
    }
}

export class MockWithTemplateComponent extends Component {
    constructor() {
        super();
        this.template = 'test';
    }
}

export class MockWithChildrenComponent extends Component {
    constructor() {
        super();
        this.template = '<mock></mock>';
    }
}

export class MockWithParamsComponent extends Component {
    params: MockComponentParams;
}

export class MockWithElementsComponent extends Component {
    @ViviElement({selector: 'input.test', eventType: EventTypes.click, handlerFnName: 'handleClick'}) button: HTMLButtonElement;
    @ViviElement({selector: 'span.test'}) testingText: HTMLSpanElement;
    clicked: boolean = false;

    constructor() {
        super();
        this.template = '<span class="test"></span><input type="button" class="test" />';
    }

    handleClick() {
        this.clicked = true;
        this.testingText.innerHTML = 'clicked!';
    }
}