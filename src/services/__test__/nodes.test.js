import test from 'ava';
import {Nodes} from '../nodes';
import {ModuleFactory} from '../../factory/module-factory';
import {MockComponent} from '../../models/__mocks__/component.mock';

let vivi;
let service;
let rootComponent;

test.before(() => {
	vivi = new ModuleFactory({componentConstructors: [MockComponent]});
	service = vivi.get(Nodes);
	rootComponent = vivi.getFactory(MockComponent).createRoot();
});

test('should init', t => {
	const actual = new Nodes(vivi);
	t.assert(actual);
});

test('setRoot should set the application tree', t => {
	service.setRoot(rootComponent);

	t.assert(service.applicationTree);
});

test('getNode should get node of a component', t => {
	const child = vivi.getFactory(MockComponent).create(rootComponent);
	service.addComponent(rootComponent, child);

	const node = service.getNode(child);
	t.assert(node);
});

test('getNode should be able to get root', t => {
	const node = service.getNode(rootComponent);
	t.assert(node);
});
