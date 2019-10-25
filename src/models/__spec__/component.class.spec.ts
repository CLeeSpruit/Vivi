import { ModuleFactory } from '../../factory/module-factory';
import { Listener } from '../../events';
import { MockComponent, MockWithChildrenComponent, MockWithElementsComponent } from '../__mocks__/component.class';

describe('Class: Component', () => {
    const mockModule = () => {
        return new ModuleFactory({
            componentConstructors: [
                { constructor: MockComponent },
                { constructor: MockWithChildrenComponent },
                { constructor: MockWithElementsComponent }
            ]
        });
    };

    beforeEach(() => {
        window.vivi = mockModule();
    });

    afterEach(() => {
        // Clear the document
        for (let i = 0; i < document.body.children.length; i++) {
            document.body.children.item(i).remove();
        }
    });

    it('should init', () => {
        const component = new MockComponent();

        expect(component).toBeTruthy();
    });

    it('should grab the application event service', () => {
        const component = new MockComponent();

        expect(component.appEvents).toBeTruthy();
    });

    it('should append to document body if parent is not provided', () => {
        const component = new MockComponent();

        component.append();

        expect(component.parent).toEqual(document.body);
        expect(component.isLoaded).toBeTruthy();
        expect(component.isVisible).toBeTruthy();
        expect(component.element).toBeTruthy();
    });

    it('should append to parent', () => {
        const component = new MockComponent();
        const mockParent = document.createElement('parent');
        document.body.appendChild(mockParent);

        component.append(mockParent);

        expect(component.parent).toEqual(mockParent);
        const template = document.getElementById(component.id);
        expect(template.innerHTML).toEqual(component.template);
    });

    describe('beforeLoad', () => {
        it('should automatically add elements and bind them', () => {
            const component = new MockWithElementsComponent();
            component.append();
            
            component.button.click();

            expect(component.clicked).toBeTruthy();
        });

        it('should accept element selectors without events', () => {
            const component = new MockWithElementsComponent();
            component.append();
            
            component.button.click();

            expect(component.testingText.innerHTML).toEqual('clicked!');
        });
    });

    describe('detach', () => {
        it('should remove element from DOM', () => {
            const component = new MockComponent();
            const mockParent = document.createElement('parent');
            document.body.appendChild(mockParent);

            component.append(mockParent);

            component.detach();

            expect(component.element.isConnected).toBeFalsy();
            expect(component.isLoaded).toBeFalsy();
            expect(component.isVisible).toBeFalsy();
            expect(component.parent).toBeNull();
        });
    });

    describe('destroy', () => {
        it('should remove any listeners', () => {
            const component = new MockComponent();
            const listen = new Listener('test', null, null);
            component.listeners.push(listen);
            const removeSpy = spyOn(listen, 'remove');

            component.destroy();

            expect(removeSpy).toHaveBeenCalled();
        });
    });

    describe('listen', () => {
        it('creates a listener for an element', (done) => {
            const component = new MockComponent();

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
            const component = new MockComponent();

            component.appListen('test', () => {
                expect(true).toBeTruthy();
                done();
            });

            component.appEvents.sendEvent('test', {});
        });
    });
});