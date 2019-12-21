import test from 'ava';
import {ApplicationListener} from '../application-listener';
import { Observable, Subject } from 'rxjs';

test('should init', t => {
    const actual = new ApplicationListener('', null, new Observable());
    t.assert(actual);
});

test('should emit callback when subscription is updated', t => {
    const subject = new Subject();
    const actual = new ApplicationListener('', () => {
        t.pass();
    }, subject.asObservable());
    subject.next();
    subject.complete();
});

test('should close if the event has close on complete', t => {
    const subject = new Subject();
    const actual = new ApplicationListener('', () => {}, subject.asObservable());
    subject.next({ data: {}, closeOnComplete: true});
    t.assert(actual.subscription)
});