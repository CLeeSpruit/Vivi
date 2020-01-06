
import {Component} from '../component';

export class MockComponent extends Component {
	load() {
		this.mockService = this.factoryService.get('MockService');
	}
}

export class MockChildComponent extends Component {}
