import { Component } from '../component.class';
import { MockComponentParams } from './component-params.class';

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