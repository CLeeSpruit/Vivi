import { GetElNameFromComponent } from '../get-el-name-from-component';

describe('GetElNameFromClass', () => {
    it('should get a simple component name', () => {
        const actual = GetElNameFromComponent('MockComponent');

        expect(actual).toEqual('mock');
    });

    it('should get complex component name', () => {
        const actual = GetElNameFromComponent('MyCoolComponent');

        expect(actual).toEqual('my-cool');
    });

    it('should get multiword complex component name', () => {
        const actual = GetElNameFromComponent('MyReallyReallyCoolComponent');

        expect(actual).toEqual('my-really-really-cool');
    });
});