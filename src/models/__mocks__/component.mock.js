
import {Component} from '../component';

export class MockComponent extends Component {
	constructor(mockService) {
		super();
		this.mockService = mockService;
	}
}

export class MockChildComponent extends Component {}
