import { ParseComponents } from '../components';
import { Mocker } from '../../../meta/mocker';
import { FactoryService } from '../../factory.service';
import { Component } from '../../../models';
import { ModuleFactory } from '../../../factory';

describe('Component Parse Engine', () => {
    const mock = new Mocker();
    const factory = mock.module.getFactory(FactoryService).get() as FactoryService;

    afterEach(() => {
        mock.clearMocks();
    });

    it('should init', () => {
        const parse = new ParseComponents(null);

        expect(parse).toBeTruthy();
    });

    it('should init with module', () => {
        const parse = new ParseComponents(factory);

        expect(parse).toBeTruthy();
    });

    describe('Parse Components', () => {
        const parse = new ParseComponents(factory);

        it('should return empty list if there are no components', () => {
            const comp = mock.createMock({ hasChild: false });

            const actual = parse.parseComponents(comp.parsedNode);

            expect(actual.length).toEqual(0);
        });

        it('should return components of chilren', () => {
            const comp = mock.createMock({ template: '<mock></mock>' });

            expect(comp.children.length).toEqual(1);
        });

        it('should return multiple components of children', () => {
            const comp = mock.createMock({ template: '<mock></mock><mock></mock>' });

            expect(comp.children.length).toEqual(2);
        });

        it('should not throw console error when loading chilren after parse', () => {
            const errorSpy = spyOn(console, 'error');
            const comp = mock.createMock({ template: '<mock></mock>' });

            expect(errorSpy).not.toHaveBeenCalled();
            expect(comp.children[0].element).toBeTruthy();
        });

        it('grandchildren should not try to rerender', () => {
            let counter = 0;
            class GrandparentComponent extends Component {
                constructor() {
                    super();
                    this.template = '<parent></parent>';
                    counter++;
                }
            }

            class ParentComponent extends Component {
                constructor() {
                    super();
                    this.template = '<child></child>';
                    counter++;
                }
            }

            class ChildComponent extends Component {
                constructor() {
                    super();
                    this.template = '<span>Test</span>';
                    counter++;
                }
            }

            const module = new ModuleFactory({
                componentConstructors: [
                    { constructor: GrandparentComponent },
                    { constructor: ParentComponent },
                    { constructor: ChildComponent }
                ],
                rootComponent: GrandparentComponent
            });
            expect(counter).toEqual(3);
        });
    });
});