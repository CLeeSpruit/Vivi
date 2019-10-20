import { ApplicationEventService } from '../application-event.service';
import { ApplicationListener } from '../../events';

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