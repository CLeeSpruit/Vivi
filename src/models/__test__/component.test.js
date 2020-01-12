import test from 'ava';
import {Component} from '../component';
import {MockComponent} from '../__mocks__/component.mock';
import {ModuleFactory} from '../../factory/module-factory';

const vivi = new ModuleFactory({componentConstructors: [MockComponent]});
const factory = vivi.getFactory(MockComponent);
let rootComponent;
// Create root
test.before(() => {
	// Create root so the subsequent components can attach to
	rootComponent = factory.createRoot();
});

test('should init', t => {
	const actual = new Component(vivi);
	t.assert(actual);
});

test('should assign template and style', t => {
	const comp = factory.create(rootComponent);
	comp.setFiles();
	t.is(comp.template, '');
	t.is(comp.style, '');
});

test('append should parse node', t => {
	const comp = factory.create(rootComponent);
	const data = {name: 'test'};
	comp.setData(1, data);
	comp.append(document.body);

	t.assert(comp.parsedNode);
});

test('listen should create a listener for an element', t => {
	const comp = factory.create(rootComponent);
	const el = document.createElement('button');
	comp.listen(el, 'click', () => t.pass());
	el.click();
});

test('should redraw with new params', t => {
	const comp = factory.create(rootComponent);
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
	const comp = factory.create(rootComponent);
	const child = comp.createChild(comp.element, MockComponent);
	t.assert(child);
});
