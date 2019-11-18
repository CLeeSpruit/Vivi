import { Listener, EventTypes } from '../../events';
import { Mocker } from '../../meta/mocker';

describe('Class: Component', () => {
    const mock = new Mocker();

    afterEach(() => {
        mock.clearMocks();
    });

    describe('Constructor', () => {
        it('should init via creator', () => {
            const component = mock.createMock();

            expect(component).toBeTruthy();
        });

        it('should grab the application event service', () => {
            const component = mock.createMock();

            expect(component.appEvents).toBeTruthy();
        });

        it('should assign template and style', () => {
            const component = mock.createMock();

            expect(component.template).toEqual('');
            expect(component.style).toEqual('');
        });
    });

    describe('append', () => {
        it('should create a copy of the original node', () => {
            const component = mock.createMock();

            expect(component.ogNode).toBeTruthy();
            expect(component.ogNode.id).toEqual(component.id);
        });

        it('should parse node', () => {
            const data = { name: 'test ' };
            const comp = mock.createMock({ data });

            expect(comp.parsedNode).toBeTruthy();
        });

        it('should append style to head', () => {
            const component = mock.createMock({ hasStyle: true });

            const styleTag = document.head.querySelector('style#style-mock');
            expect(component.style).toBeTruthy();
            expect(styleTag).toBeTruthy();
        });

        it('should not append style if it already exists', () => {
            const component = mock.createMock({ hasStyle: true });
            const componentB = mock.createMock({ hasStyle: true });

            const styleTags = document.head.querySelectorAll('style#style-mock');

            expect(styleTags.length).toEqual(1);
        });

        it('should append to document body if parent is not provided', () => {
            const component = mock.createMock();

            component.append();

            expect(component.parentElement).toEqual(document.body);
            expect(component.element).toBeTruthy();
        });

        it('should append to parent', () => {
            const component = mock.createMock();
            const mockParent = document.createElement('parent');
            document.body.appendChild(mockParent);

            component.append(mockParent);

            expect(component.parentElement).toEqual(mockParent);
            const template = document.getElementById(component.id);
            expect(template.innerHTML).toEqual(component.template);
        });

        it('should replace existing node in template', () => {
            const component = mock.createMock({ template: '<mock></mock>'});
            expect(component.element.children.length).toEqual(1);
        });

        it('should automatically add elements and bind them', () => {
            const el = { propertyKey: 'test', selector: 'button.test', handlerFnName: 'testClick', eventType: EventTypes.click };
            const component = mock.createMock({
                elements: [el],
                template: `<button class="test"></button>`
            });

            const mockClick = jest.fn();
            component[el.handlerFnName] = mockClick;
            component.append();
            component[el.propertyKey].click();

            expect(mockClick.mock.calls.length).toBe(1);
        });

        it('should accept element selectors without events', () => {
            const testEl = { selector: 'span.test', propertyKey: 'testSpan' };
            const component = mock.createMock({
                elements: [testEl],
                template: `<span class="test"></span>`
            });

            component.append();

            expect(component[testEl.propertyKey]).toBeTruthy();
        });
    });

    describe('loadall', () => {
        it('should throw a warning if element is not found', () => {
            const comp = mock.createMock({ doNotAppend: true });
            const errorSpy = spyOn(console, 'warn');
            comp.loadAll();

            expect(errorSpy).toHaveBeenCalled();
        });
    });

    describe('detach', () => {
        it('should remove element from DOM', () => {
            const component = mock.createMock();
            const mockParent = document.createElement('parent');
            document.body.appendChild(mockParent);

            component.append(mockParent);

            component.detach();

            expect(component.element.isConnected).toBeFalsy();
            expect(component.parentElement).toBeNull();
        });
    });

    describe('destroy', () => {
        it('should remove any listeners', () => {
            const component = mock.createMock();
            const listen = new Listener('test', null, null);
            component.listeners.push(listen);
            const removeSpy = spyOn(listen, 'remove');

            component.destroy();

            expect(removeSpy).toHaveBeenCalled();
        });
    });

    describe('listen', () => {
        it('creates a listener for an element', (done) => {
            const component = mock.createMock();

            const el = document.createElement('button');

            component.listen(el, 'click', () => {
                expect(true).toBeTruthy();
                done();
            });

            el.click();
        });
    });

    describe('appListen', () => {
        it('creates an appListener for an event', (done) => {
            const component = mock.createMock();

            component.appListen('test', () => {
                expect(true).toBeTruthy();
                done();
            });

            component.appEvents.sendEvent('test', {});
        });
    });

    describe('redraw', () => {
        it('should not blow up if there is no template', () => {
            const component = mock.createMock();
            const mockParent = document.createElement('parent');
            document.body.appendChild(mockParent);

            component.append(mockParent);
            component.redraw();

            expect(component).toBeTruthy();
        });

        it('should not blow up if there is no element', () => {
            const component = mock.createMock();

            component.redraw();

            expect(component).toBeTruthy();
        });

        it('should redraw with new params', () => {
            const component = mock.createMock({
                data: { name: 'fluffy' },
                template: `<span v-innerHTML="this.name"></span>`
            });

            component.append();

            const newName = 'bunny';
            component.data = { name: newName };

            component.redraw();

            const componentEl = document.getElementById(component.id);
            const actual = componentEl.querySelector('span');

            expect(actual.innerHTML).toEqual(newName);
        });
    });
});