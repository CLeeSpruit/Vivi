
import {Component} from '../component';

export class MockComponent extends Component {
	load() {
		this.mockService = this.vivi.get('MockService');
	}
}

export class MockChildComponent extends Component {}
