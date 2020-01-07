import test from 'ava';
import {Component} from '../component';
import {MockComponent} from '../__mocks__/component.mock';
import {ModuleFactory} from '../../factory/module-factory';

const vivi = new ModuleFactory({componentConstructors: [MockComponent]});

test('should init', t => {
	const actual = new Component(vivi);
	t.assert(actual);
});

test('should init with default services', t => {
	const comp = new Component(vivi);
	comp.setData(1);
	t.assert(comp.appEvents);
	t.assert(comp.engine);
	t.assert(comp.nodeTreeService);
});

test('should assign template and style', t => {
	const comp = new Component(vivi);
	comp.setFiles();
	t.is(comp.template, '');
	t.is(comp.style, '');
});

test('append should parse node', t => {
	const comp = new Component(vivi);
	const data = {name: 'test'};
	comp.setData(1, data);
	comp.append(document.body);

	t.assert(comp.parsedNode);
});

test('append should append style to head', t => {
	const comp = new Component(vivi);
	comp.style = 'mock: { color: red; }';
	comp.append(document.body);

	const styleTag = document.head.querySelector('style#style-mock');
	t.assert(styleTag);
});

test('append should not append style if it already exists', t => {
	const comp = new Component(vivi);
	comp.style = 'mock: { color: red; }';
	comp.append(document.body);
	comp.append(document.body);

	const styleTags = document.head.querySelectorAll('style#style-mock');

	t.is(styleTags.length, 1);
});

// Error handling
test.todo('append should throw error if parent is not provided');

test('append should append to parent', t => {
	const comp = new Component(vivi);
	comp.template = '<div>Test</div>';
	const mockParent = document.createElement('parent');
	document.body.append(mockParent);

	comp.append(mockParent);

	t.assert(mockParent.children.length);
	const template = document.querySelector('#' + comp.id);
	t.is(template.innerHTML, comp.template);
});

test('append should replace existing node in template', t => {
	const comp = new Component(vivi);
	comp.template = '<mock></mock>';
	comp.append(document.body);

	t.is(comp.element.children.length, 1);
});

// Decorators are not working atm
test.todo('append should automatically add elements and bind them');

test.todo('should accept element selectors without events');

// Error handling
test.todo('loadall should throw a warning if element is not found');

test('detach should remove element from DOM', t => {
	const comp = new Component(vivi);
	comp.append(document.body);
	comp.detach();
	t.falsy(comp.element.isConnected);
});

test('listen should create a listener for an element', t => {
	const comp = new Component(vivi);
	const el = document.createElement('button');
	comp.listen(el, 'click', () => t.pass());
	el.click();
});

test('appListen should create an application listener', t => {
	const comp = new Component(vivi);

	comp.appListen('test', () => t.pass());
	comp.appEvents.sendEvent('test', {});
});

test('redraw should not blow up if there is no template', t => {
	const comp = new Component(vivi);
	const mockParent = document.createElement('parent');
	document.body.append(mockParent);

	comp.append(mockParent);
	comp.redraw();
	t.assert(comp);
});

test('should not blow up if there is no element', t => {
	const comp = new Component(vivi);
	comp.redraw();
	t.assert(comp);
});

test('should redraw with new params', t => {
	const comp = new Component(vivi);
	comp.setData(1, {name: 'fluffy'});
	comp.template = '<span v-innerHTML="this.name"></span>';

	const newName = 'bunny';
	comp.data = {name: newName};

	comp.redraw();

	const componentEl = document.querySelector('#' + comp.id);
	const actual = componentEl.querySelector('span');

	t.deepEqual(actual.innerHTML, newName);
});

test('create child should create and return component', t => {
	const comp = new Component(vivi);
	const child = comp.createChild(comp.element, MockComponent);
	t.assert(child);
});
