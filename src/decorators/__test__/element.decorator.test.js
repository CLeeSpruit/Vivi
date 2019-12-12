import test from 'ava';
import { ViviElement, getElements } from '../element.decorator';

test('should return a function', t => {
    const fn = ViviElement({ selector: 'test' });
    t.assert(fn instanceof Function);
});

test('should decorate a property', t => {
    class ElementComponent {
        @ViviElement({ selector: 'test' }) testElement;
    }

    const comp = new ElementComponent();
    const arr = getElements(comp);
    t.assert(arr.length === 1);
});

test('should deocrate multiple properties', t => {
    class ElementComponent {
        @ViviElement({ selector: 'test' }) testElement;
        @ViviElement({ selector: 'test2'}) testElement2;
    }

    const comp = new ElementComponent();
    const arr = getElements(comp);
    t.assert(arr.length === 2);
});