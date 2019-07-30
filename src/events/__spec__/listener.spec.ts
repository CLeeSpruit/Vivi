import { Listener } from '../';

describe('Class: Listener', () => {
    it('should init', () => {
        const component = new Listener('test', null, null);

        expect(component).toBeTruthy();
    });
});