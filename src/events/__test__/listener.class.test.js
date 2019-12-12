import test from 'ava';
import { Listener } from '../listener.class';

let listener = null;
test.afterEach.always(() => {
    if (listener) {
        try {
            listener.remove()
        } catch {
            // Error intentionally eaten.
        }
    }
});

test('should init', t => {
    listener = new Listener('test', null, null);

    t.assert(listener);
});

test('add - should not do anything if there is no element', t => {
    listener = new Listener('test', null, null);
    listener.add();
    t.notThrows(() => listener.add());
});

test('remove - should not do anything if there is no element', t => {
    listener = new Listener('test', null, null);
    listener.remove();
    t.notThrows(() => listener.remove());
});

test.todo('add - should add an event listener to the element');

test.todo('remove - should remove event listener from the element');

test.todo('custom events - all - should trigger call back on event');

test.todo('keypress - enter - should trigger cb on keypress:enter');

test.todo('keypress - enter - should not trigger cb on keypress:anything else');

test.todo('scroll up - should trigger cb on mouse scroll up');

test.todo('scoll up - should not trigger cb on mouse scroll down');

test.todo('scroll down - should trigger cb on mouse scroll down');

test.todo('scoll down - should not trigger cb on mouse scroll up');