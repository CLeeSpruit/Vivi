import { createModule } from './index';

describe('Integration Tests- Module', () => {
    it('should init', () => {
        const vivi = createModule();

        expect(vivi).toBeTruthy();
    });
});