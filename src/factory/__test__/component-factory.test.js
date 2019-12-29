import test from 'ava';
import {Mocker} from '../../meta/mocker';
import {ComponentFactory} from '../component-factory';
import {MockComponent} from '../../models/__mocks__/component.mock';
import {NodeTreeService} from '../../services/node-tree.service';

const mock = new Mocker();
test.afterEach(() => {
	mock.clearMocks();
});

test('should init', t => {
	const actual = new ComponentFactory(MockComponent);
	t.assert(actual);
});

test('should create a new component and return that component', t => {
	const mock = new ComponentFactory(MockComponent);
	const actual = mock.create(null, null, {isRoot: true});
	t.assert(actual);
	t.assert(actual instanceof MockComponent);
});

test('should create with services', t => {
	const actual = mock.createMock();
	t.assert(actual.mockService);
});

test('should create component and set root in nodeTreeService', t => {
	const mock = new ComponentFactory(MockComponent);
	const nodeTreeService = new NodeTreeService();
	mock.createRoot(nodeTreeService);
	const actual = mock.get();
	t.assert(actual);
	t.assert(nodeTreeService.applicationTree);
});

// Error related. Refactor.
test.todo('detach should throw error and do nothing if the component does not exist');

test('should detach and return node tree', t => {
	const comp = mock.createMock();
	const actual = mock.getFactory().detach(comp.id);
	t.assert(actual);
	t.falsy(actual.component.element.isConnected);
});

test('destroy should trigger component destroy', t => {
	const comp = mock.createMock();
	const actual = mock.getFactory().detach(comp.id);
	t.assert(actual);
	t.truthy(actual.component.element.isConnected);
});

test('destroy should remove from the DOM', t => {
	const comp = mock.createMock();
	comp.append(document.body);

	mock.getFactory().destroy(comp.id);

	const actual = document.querySelector(comp.id);
	t.falsy(actual);
});
