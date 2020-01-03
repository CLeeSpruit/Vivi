import test from 'ava';
import {Component} from '../component';
import {Mocker} from '../../meta/mocker';
import {MockComponent} from '../__mocks__/component.mock';

test('should init', t => {
	const actual = new Component();
	t.assert(actual);
});

const mock = new Mocker();
test('should init with default services', t => {
	const actual = mock.createMock();
	t.assert(actual.factoryService);
	t.assert(actual.appEvents);
	t.assert(actual.engine);
	t.assert(actual.nodeTreeService);
});

test('should assign template and style', t => {
	const comp = mock.createMock();
	t.is(comp.template, '');
	t.is(comp.style, '');
});

test('append should parse node', t => {
	const data = {name: 'test'};
	const comp = mock.createMock(data);

	t.assert(comp.parsedNode);
});

test('append should append style to head', t => {
	const component = mock.createMock({hasStyle: true});

	const styleTag = document.head.querySelector('style#style-mock');
	t.assert(component.style);
	t.assert(styleTag);
});

test('append should not append style if it already exists', t => {
	mock.createMock({hasStyle: true});
	mock.createMock({hasStyle: true});

	const styleTags = document.head.querySelectorAll('style#style-mock');

	t.is(styleTags.length, 1);
});

// Error handling
test.todo('append should throw error if parent is not provided');

test('append should append to parent', t => {
	const component = mock.createMock();
	const mockParent = document.createElement('parent');
	document.body.append(mockParent);

	component.append(mockParent);

	t.assert(mockParent.children.length);
	const template = document.querySelector('#' + component.id);
	t.is(template.innerHTML, component.template);
});

test('append should replace existing node in template', t => {
	const component = mock.createMock({template: '<mock></mock>'});
	t.is(component.element.children.length, 1);
});

// Decorators are not working atm
test.todo('append should automatically add elements and bind them');

test.todo('should accept element selectors without events');

// Error handling
test.todo('loadall should throw a warning if element is not found');

test('detach should remove element from DOM', t => {
	const component = mock.createMock();
	component.detach();
	t.falsy(component.element.isConnected);
});

test('listen should create a listener for an element', t => {
	const component = mock.createMock();
	const el = document.createElement('button');
	component.listen(el, 'click', () => t.pass());
	el.click();
});

test('appListen should create an application listener', t => {
	const component = mock.createMock();

	component.appListen('test', () => t.pass());
	component.appEvents.sendEvent('test', {});
});

test('redraw should not blow up if there is no template', t => {
	const component = mock.createMock();
	const mockParent = document.createElement('parent');
	document.body.append(mockParent);

	component.append(mockParent);
	component.redraw();
	t.assert(component);
});

test('should not blow up if there is no element', t => {
	const component = mock.createMock();
	component.redraw();
	t.assert(component);
});

test('should redraw with new params', t => {
	const component = mock.createMock({
		data: {name: 'fluffy'},
		template: '<span v-innerHTML="this.name"></span>'
	});

	const newName = 'bunny';
	component.data = {name: newName};

	component.redraw();

	const componentEl = document.querySelector('#' + component.id);
	const actual = componentEl.querySelector('span');

	t.deepEqual(actual.innerHTML, newName);
});

test('create child should create and return component', t => {
	const comp = mock.createMock();
	const child = comp.createChild(comp.element, MockComponent);
	t.assert(child);
});
