import test from 'ava';
import {ParseEngineService} from '../parse-engine.service';
import {ModuleFactory} from '../../factory/module-factory';
import {attributeList} from '../../meta/attribute-list';
import {MockComponent} from '../../models/__mocks__/component.mock';

const vivi = new ModuleFactory();
const factory = vivi.createFactory(MockComponent);
const service = vivi.get('ParseEngineService');

test('should init', t => {
	const parseEngine = new ParseEngineService(vivi);
	t.assert(parseEngine);
});

test('should work', t => {
	const node = document.createElement('div');
	const comp = factory.createRoot();
	service.parse(node, {}, comp);
	t.assert(node);
});

test('should work even if an element is just text', t => {
	const node = document.createElement('div');
	const comp = factory.createRoot();
	node.textContent = 'test';

	service.parse(node, {}, comp);
	t.assert(node);
});

const setup = (attr, value, data) => {
	const node = document.createElement('div');
	const child = document.createElement('div');
	const comp = factory.createRoot();
	child.setAttribute(attr, value);
	node.append(child);
	service.parse(node, data, comp);

	return node;
};

const testAttribute = attr => {
	const normalAttrName = attr.replace('v-', '');
	test(`${attr} - should evaluate data objects`, t => {
		const data = {fluffy: 'bunny'};
		const value = 'this.fluffy';
		factory.createRoot();
		const node = setup(attr, value, data);
		const actual = node.querySelector('div');
		t.assert(actual);
		t.is(actual.getAttribute(normalAttrName), data.fluffy);
		t.is(actual.getAttribute('data-' + attr), value);
		t.falsy(actual.getAttribute(attr));
	});
};

const testAttributeIf = attr => {
	const normalAttrName = attr.replace('vif-', '');

	test(attr + ' - should only render an attribute if the result is true', t => {
		const data = {fluffy: 'bunny'};
		const value = '(this.fluffy === \'bunny\') ? this.fluffy';
		const node = setup(attr, value, data);

		const actual = node.querySelector('div');
		t.is(actual.getAttribute(normalAttrName), data.fluffy);
	});

	test(attr + ' - should not render an attribute if the result is false', t => {
		const data = {fluffy: 'puppy'};
		const value = '(this.fluffy === \'bunny\') ? this.fluffy';
		const node = setup(attr, value, data);

		const actual = node.querySelector('div');
		t.falsy(actual.getAttribute(normalAttrName));
	});

	test(attr + ' - should only render the true value if the result is true', t => {
		const data = {fluffy: 'bunny'};
		const value = '(this.fluffy === \'bunny\') ? this.fluffy : this.puppy';
		const node = setup(attr, value, data);

		const actual = node.querySelector('div');
		t.is(actual.getAttribute(normalAttrName), data.fluffy);
	});

	test(attr + ' - should only render the false value if the result is false', t => {
		const data = {fluffy: 'puppy', puppy: 'cute'};
		const value = '(this.fluffy === \'bunny\') ? this.fluffy : this.puppy';
		const node = setup(attr, value, data);

		const actual = node.querySelector('div');
		t.is(actual.getAttribute(normalAttrName), data.puppy);
	});

	test(attr + ' - should not render as true if the result is garbage', t => {
		const data = {fluffy: 'puppy'};
		const value = '(whatever) ? this.fluffly';
		const node = setup(attr, value, data);

		const actual = node.querySelector('div');
		t.falsy(actual.getAttribute(normalAttrName));
	});

	test(attr + ' - should not render if the conditional is not formatted properly', t => {
		const data = {fluffy: 'bunny'};
		const value = 'whatever ? this.fluffy';
		const node = setup(attr, value, data);

		const actual = node.querySelector('div');
		t.falsy(actual.getAttribute(normalAttrName));
	});

	test(attr + ' - should not render if the result is missing', t => {
		const data = {fluffy: 'bunny'};
		const value = '(this.fluffy) ?';
		const node = setup(attr, value, data);

		const actual = node.querySelector('div');
		t.falsy(actual.getAttribute(normalAttrName));
	});
};

// Any v- prop
// This only runs when the --full flag is provided as you probably don't need to run it every time. It's very rare these tests break and others don't.
if (process.argv.find(arg => arg === 'full')) {
	attributeList.forEach(attr => {
		testAttribute('v-' + attr);
	});
}

test('v-class - should add a list of classes', t => {
	const data = {fluffy: 'bunny', puppy: 'bow-wow'};
	const value = 'this.fluffy this.puppy';
	const node = setup('v-class', value, data);
	const actual = node.querySelector('div');

	t.is(actual.classList.value, 'bunny bow-wow');
});

test('v-innerHTML - should add content to innerHTML', t => {
	const data = {fluffy: 'bunny'};
	const value = 'this.fluffy';
	const node = setup('v-innerHTML', value, data);
	const actual = node.querySelector('div');

	t.is(actual.innerHTML, data.fluffy);
});

// Any Vif- prop
// This only runs when the --full flag is provided as you probably don't need to run it every time. It's very rare these tests break and others don't.
if (process.argv.find(arg => arg === 'full')) {
	attributeList.forEach(attr => {
		testAttributeIf('vif-' + attr);
	});
}

test('vif-class should add a list of classes if true', t => {
	const data = {fluffy: 'bunny', puppy: 'bow'};
	const value = '(this.fluffy === \'bunny\') ? this.fluffy this.puppy : this.puppy';
	const node = setup('vif-class', value, data);
	const actual = node.querySelector('div');

	t.is(actual.classList.value, 'bunny bow');
});

test('vif-class should add a list of classes from data and strings', t => {
	const data = {fluffy: 'bunny'};
	const value = '(this.fluffy === \'bunny\') ? this.fluffy pupper : this.puppy';
	const node = setup('vif-class', value, data);

	const actual = node.querySelector('div');
	t.is(actual.classList.value, 'bunny pupper');
});

test('vif-innerHTML should add content to innerHTML if true', t => {
	const data = {fluffy: 'bunny'};
	const value = '(this.fluffy === \'bunny\') ? this.fluffy : bow';
	const node = setup('vif-innerHTML', value, data);
	const actual = node.querySelector('div');

	t.is(actual.innerHTML, 'bunny');
});

test('v-if nodes should render the node if value is truthy', t => {
	const data = {fluffy: 'bunny'};
	const value = 'this.fluffy === \'bunny\'';
	const node = setup('v-if', value, data);
	const actual = node.querySelector('div');

	t.assert(actual);
});

test('v-if nodes should not render the node if value is falsy', t => {
	const data = {fluffy: 'puppy'};
	const value = 'this.fluffy === \'bunny\'';
	const node = setup('v-if', value, data);
	const actual = node.querySelector('div');

	t.falsy(actual);
});

test('v-each nodes should render a list of components and supply object as data', t => {
	const data = {
		puppies: [
			{breed: 'Collie'},
			{breed: 'Lab'},
			{breed: 'Shiba'},
			{breed: 'German Shepard'}
		]
	};
	const value = 'this.puppies as MockComponent';
	const node = setup('v-each', value, data);
	const actual = node.querySelector('div');

	t.is(actual.children.length, data.puppies.length);
	const {id} = actual.children.item(0);
	const childComp = factory.get(id);
	t.is(childComp.data, data.puppies[0]);
});

test('v-each nodes should not render if value does not match proper syntax', t => {
	const data = {
		puppies: [
			{breed: 'Collie'},
			{breed: 'Lab'},
			{breed: 'Shiba'},
			{breed: 'German Shepard'}
		]
	};
	const value = 'this.puppies';
	const node = setup('v-each', value, data);
	const actual = node.querySelector('div');

	t.is(actual.children.length, 0);
});

test('v-each nodes should not render if data is not array', t => {
	const data = {
		puppies: 'are cute'
	};
	const value = 'this.puppies as MockComponent';
	const node = setup('v-each', value, data);
	const actual = node.querySelector('div');

	t.is(actual.children.length, 0);
});
