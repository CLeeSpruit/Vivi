import { Component } from '../component.class';
import { MockService } from './service.class';

export class MockComponent extends Component {
    constructor(public mockService: MockService) {
        super();
    }
}