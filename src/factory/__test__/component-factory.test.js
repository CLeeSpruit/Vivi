import test from 'ava';
import {ComponentFactory} from '../component-factory';
import {MockComponent} from '../../models/__mocks__/component.mock';
import {ModuleFactory} from '../module-factory';

const vivi = new ModuleFactory();
const factory = vivi.createFactory(MockComponent);

test.afterEach(() => {
	vivi.getFactory('MockComponent').destroyAll();
});

test('should init', t => {
	const actual = new ComponentFactory(MockComponent, vivi);
	t.assert(actual);
});

test('should create a new component and return that component', t => {
	const actual = factory.create();
	t.assert(actual);
	t.assert(actual instanceof MockComponent);
});

test('should create component and set root in nodeTreeService', t => {
	factory.createRoot();
	const actual = factory.get();
	t.assert(actual);
	t.assert(vivi.get('NodeTreeService').applicationTree);
});
