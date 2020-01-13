
import {Component} from '../component';

export class MockComponent extends Component {}
export class MockChildComponent extends Component {}
export class MockLoadComponent extends Component {
	load() {
		this.childComponent = this.createChild(this.element, MockComponent);
	}
}
