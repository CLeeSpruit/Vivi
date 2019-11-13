import { getElements, ViviElement } from '../element.decorator';
import { Mocker } from '../../meta/mocker';

describe('ViviElement', () => {
    const mock = new Mocker();

    afterEach(() => {
        mock.clearMocks();
    });

    describe('ViviElement fn', () => {
        it('should return a function', () => {
            const fn = ViviElement({ selector: 'test' });

            expect(fn).toBeInstanceOf(Function);
        });

        it('should decorate a property', () => {
            class ElementComponent {
                @ViviElement({ selector: 'test' }) testElement;
            }

            const comp = new ElementComponent();

            const arr = getElements(comp);

            expect(arr.length).toEqual(1);
        });

        it('should decorate multiple properties', () => {
            class ElementComponent {
                @ViviElement({ selector: 'test' }) testElement;
                @ViviElement({ selector: 'test2'}) testElement2;
            }

            const comp = new ElementComponent();

            const arr = getElements(comp);

            expect(arr.length).toEqual(2);
        });
    });

    describe('getElements', () => {
        it('should retrieve array of elements', () => {
            const comp = mock.createMock({ hasElements: true });
            const arr = getElements(comp);

            expect(arr.length).toEqual(1);
        });

        it('should retrieve empty array if there is no elements', () => {
            const comp = mock.createMock();

            const arr = getElements(comp);

            expect(arr.length).toBeFalsy();
        });
    });
});