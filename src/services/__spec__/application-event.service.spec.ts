import { ApplicationEventService } from '../application-event.service';
import { ApplicationListener, ApplicationEvent } from '../../events';
import { map } from 'rxjs/operators';

describe('ApplicationEventService', () => {
    it('should init', () => {
        const service = new ApplicationEventService();

        expect(service).toBeTruthy();
    });

    describe('Create Listener', () => {
        it('should return an application listener', () => {
            const service = new ApplicationEventService();
            const listen = service.createListener('test', null);

            expect(listen).toBeInstanceOf(ApplicationListener);
        });

        it('should create a new entry if it is a new event', () => {
            const service = new ApplicationEventService();
            service.createListener('test', null);
            expect(service.eventRegistry.size).toEqual(1);
        });

        it('should not create a new entry if it is not a new event', () => {
            const service = new ApplicationEventService();
            service.createListener('test', null);
            service.createListener('test', null);
            expect(service.eventRegistry.size).toEqual(1);
        });

        it('should automatically send through event if options.getCurrentValue flag is true', (done) => {
            const service = new ApplicationEventService();
            service.createListener('test', () => {
                expect(true).toBeTruthy();
                done();
            }, { getCurrentValue: true });
        });

        
        it('should add pipes if provided in options.pipe', (done) => {
            const service = new ApplicationEventService();
            const pipe = map<ApplicationEvent, ApplicationEvent>((value) => {
                value.data = 2;
                return value;
            });

            service.createListener('test', (data) => {
                expect(data).toEqual(2);
                done();
            }, { pipe });

            service.sendEvent('test', 1);
        });
    });

    describe('Send Event', () => {
        it('should send an event to any listeners', (done) => {
            const service = new ApplicationEventService();
            service.createListener('test', () => {
                expect(true).toBeTruthy();
                done();
            });

            service.sendEvent('test', null, true);
        });

        it('should should add to the registry if there are no subscribers', () => {
            const service = new ApplicationEventService();
            service.sendEvent('test', null);
            expect(service.eventRegistry.size).toEqual(1);
        });
    });
});