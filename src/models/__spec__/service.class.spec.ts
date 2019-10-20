import { MockService } from '../__mocks__/service.class';
import { Listener } from '../../events';

describe('Service Class', () => {
    it('should init', () => {
        const service = new MockService();

        expect(service).toBeTruthy();
    });

    describe('destroy', () => {
        it('should remove any listeners', () => {
            const service = new MockService();
            const listen = new Listener('test', null, null);
            service.listeners.push(listen);
            const removeSpy = spyOn(listen, 'remove');

            service.destroy();

            expect(removeSpy).toHaveBeenCalled();
        });
    });
});