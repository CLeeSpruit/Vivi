import { Component } from '../component.class';

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