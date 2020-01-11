import test from 'ava';
import {Component} from '../component';
import {MockComponent} from '../__mocks__/component.mock';
import {ModuleFactory} from '../../factory/module-factory';

const vivi = new ModuleFactory({componentConstructors: [MockComponent]});
const factory = vivi.getFactory(MockComponent);

test('should init', t => {
	const actual = new Component(vivi);
	t.assert(actual);
});

test('should init with default services', t => {
	const comp = factory.create();
	comp.setData(1);
	t.assert(comp.appEvents);
	t.assert(comp.engine);
	t.assert(comp.nodeTreeService);
});

test('should assign template and style', t => {
	const comp = factory.create();
	comp.setFiles();
	t.is(comp.template, '');
	t.is(comp.style, '');
});

test('append should parse node', t => {
	const comp = factory.create();
	const data = {name: 'test'};
	comp.setData(1, data);
	comp.append(document.body);

	t.assert(comp.parsedNode);
});

test('append should append to parent', t => {
	const comp = factory.create();
	comp.template = '<div>Test</div>';
	const mockParent = document.createElement('parent');
	document.body.append(mockParent);

	comp.append(mockParent);

	t.assert(mockParent.children.length);
	const template = document.querySelector('#' + comp.id);
	t.is(template.innerHTML, comp.template);
});

test('append should replace existing node in template', t => {
	const comp = factory.create();
	comp.template = '<mock></mock>';
	comp.append(document.body);

	t.is(comp.element.children.length, 1);
});

test('listen should create a listener for an element', t => {
	const comp = factory.create();
	const el = document.createElement('button');
	comp.listen(el, 'click', () => t.pass());
	el.click();
});

test('appListen should create an application listener', t => {
	const comp = factory.create();

	comp.appListen('test', () => t.pass());
	comp.appEvents.sendEvent('test', {});
});

test('redraw should not blow up if there is no template', t => {
	const comp = factory.create();
	const mockParent = document.createElement('parent');
	document.body.append(mockParent);

	comp.append(mockParent);
	comp.redraw();
	t.assert(comp);
});

test('should not blow up if there is no element', t => {
	const comp = factory.create();
	comp.redraw();
	t.assert(comp);
});

test('should redraw with new params', t => {
	const comp = factory.create();
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
	const comp = factory.create();
	const child = comp.createChild(comp.element, MockComponent);
	t.assert(child);
});
