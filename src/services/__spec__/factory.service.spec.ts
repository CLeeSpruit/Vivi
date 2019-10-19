import { FactoryService } from '../factory.service';
import { ModuleFactory, ViviComponentFactory, ViviServiceFactory } from '../../factory';
import { MockComponent } from '../../models/__mocks__/component.class';
import { ApplicationEventService } from '../application-event.service';

describe('Factory Service', () => {
    let service: FactoryService;

    beforeEach(() => {
        const vivi = new ModuleFactory({ componentConstructors: [{ constructor: MockComponent }] });
        service = vivi.get(FactoryService) as FactoryService;
    });

    it('should init', () => {
        expect(service).toBeTruthy();
    });

    it('getFactory should be able to return factory of a component', () => {
        const component = service.getFactory(MockComponent) as ViviComponentFactory<MockComponent>;

        expect(component).toBeTruthy();
    });

    it('getFactory should be able to return factory of a service', () => {
        const appService = service.getFactory(ApplicationEventService) as ViviServiceFactory<ApplicationEventService>;

        expect(appService).toBeTruthy();
    });

    it('getFactoryByString should be able to return factory of a component', () => {
        const component = service.getFactoryByString('MockComponent') as ViviComponentFactory<MockComponent>;

        expect(component).toBeTruthy();
    });

    it('getFactoryByString should be able to return factory of a service', () => {
        const appService = service.getFactoryByString('ApplicationEventService') as ViviServiceFactory<ApplicationEventService>;

        expect(appService).toBeTruthy();
    });
});