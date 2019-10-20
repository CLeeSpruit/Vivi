import { ApplicationListener } from '../application-listener.class';
import { Observable, Subject } from 'rxjs';
import { ApplicationEvent } from 'events/application-event.class';

describe('Application Listener', () => {
    let appListener: ApplicationListener;

    afterEach(() => {
        if (appListener) {
            appListener.close();
        }
    });

    it('should init', () => {
        appListener = new ApplicationListener('', null, new Observable());
    });

    it('should emit callback when subscription is updated', (done) => {
        const subject = new Subject<ApplicationEvent>();
        appListener = new ApplicationListener('', () => {
            expect(true).toBeTruthy();
            done();
        }, subject.asObservable());
        subject.next(<ApplicationEvent>{ data: {} });
    });

    it('should close if the event has close on complete', () => {
        const subject = new Subject<ApplicationEvent>();
        appListener = new ApplicationListener('', () => { }, subject.asObservable());
        const closeWatch = jest.spyOn(appListener, 'close');

        subject.next(<ApplicationEvent>{ data: {}, closeOnComplete: true });

        expect(closeWatch).toHaveBeenCalledTimes(1);
    });

    it('should emit whole event object if options -> emitEvent flag is on', (done) => {
        const subject = new Subject<ApplicationEvent>();
        const expected = <ApplicationEvent>{ data: {} };
        appListener = new ApplicationListener('', (event: ApplicationEvent) => {
            expect(event).toEqual(expected);
            done();
        }, subject.asObservable(), { emitEvent: true });

        subject.next(expected);
    });

    it('should emit only data if options -> emitEvent flag is off', (done) => {
        const subject = new Subject<ApplicationEvent>();
        const expected = <ApplicationEvent>{ data: 'test' };
        appListener = new ApplicationListener('', (data: any) => {
            expect(data).toEqual(expected.data);
            done();
        }, subject.asObservable(), { emitEvent: false });

        subject.next(expected);
    });

    it('remove should be an alias for clsoe', () => {
        const subject = new Subject<ApplicationEvent>();
        appListener = new ApplicationListener('', () => { }, subject.asObservable());
        const closeWatch = jest.spyOn(appListener, 'close');

        appListener.remove();

        expect(closeWatch).toHaveBeenCalledTimes(1);
    });
});