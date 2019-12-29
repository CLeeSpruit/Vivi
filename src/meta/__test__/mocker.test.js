import test from 'ava';
import {Mocker} from '../mocker';
import {MockComponent} from '../../models/__mocks__/component.mock';
import {NodeTreeService} from '../../services/node-tree.service';

let mock;
test.beforeEach(() => {
	mock = new Mocker();
});

test.afterEach(() => {
	if (mock) {
		mock.clearMocks();
	}
});

test('should init', t => {
	t.assert(new Mocker());
});

test('createMock default - should return MockComponent', t => {
	const comp = mock.createMock();

	t.assert(comp);
	t.assert(comp instanceof MockComponent);
});

test('createMock hasTemplate: true - should return component with default template', t => {
	const comp = mock.createMock({hasTemplate: true});
	t.assert(comp);
	t.is(comp.template, mock.defaultTemplate);
});

test('createMock template - should return component with provided template', t => {
	const template = '<button>Test</button>';
	const comp = mock.createMock({template});

	t.assert(comp);
	t.is(comp.template, template);
});

test('createMock hasStyle: true - should return component with default style', t => {
	const comp = mock.createMock({hasStyle: true});

	t.assert(comp);
	t.is(comp.style, mock.defaultStyle);
});

test('createMock style - should return component with provided template', t => {
	const style = '* { color: green }';
	const comp = mock.createMock({style});

	t.assert(comp);
	t.is(comp.style, style);
});

test('createMock hasChild: true - should return component with children', t => {
	const comp = mock.createMock({hasChild: true});

	t.assert(comp);
	const nodeTreeService = mock.module.get(NodeTreeService);
	const node = nodeTreeService.getNode(comp);
	t.assert(node.children.length > 0);
});

test('createMock children - should return component with provided chilren', t => {
	const children = [MockComponent];
	const comp = mock.createMock({children});

	t.assert(comp);
	const nodeTreeService = mock.module.get(NodeTreeService);
	const node = nodeTreeService.getNode(comp);
	t.is(node.children.length, children.length);
	t.assert(node.children[0].component instanceof MockComponent);
});

test('createMock hasData: true - should return component with default data object', t => {
	const comp = mock.createMock({hasData: true});

	t.assert(comp);
	t.is(comp.data, mock.defaultData);
});

test('createMock data - should return component with provided data object', t => {
	const data = {name: 'cool test'};
	const comp = mock.createMock({data});

	t.assert(comp);
	t.is(comp.data, data);
});

test('createMock all - should return component with provided options', t => {
	const template = '<button>Test</button>';
	const style = '* { color: green }';
	const children = [MockComponent];
	const data = {name: 'cool test'};

	const comp = mock.createMock({template, style, children, data});
	const nodeTreeService = mock.module.get(NodeTreeService);
	const node = nodeTreeService.getNode(comp);

	t.assert(comp);
	t.is(comp.template, template);
	t.is(comp.style, style);
	t.is(node.children.length, children.length);
	t.assert(node.children[0].component instanceof MockComponent);
	t.is(comp.data, data);
});

test.todo('createMock doNotLoad - should not automatically load component if true');

test('createMock doNotAppend - should not automatically append the component if true', t => {
	const comp = mock.createMock({doNotAppend: true});

	t.assert(comp.element).toBeFalsy();
});

test('should not throw errors if there are no components', t => {
	const mock = new Mocker();
	mock.clearMocks();
	t.pass();
});

test('should clear all existsing mocks except the root component', t => {
	const mock = new Mocker();
	mock.createMock();
	mock.createMock();
	mock.clearMocks();

	t.assert(mock.getFactory().get(), mock.rootComp);
});
