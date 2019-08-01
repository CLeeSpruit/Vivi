import { Component } from '../';

describe('Class: Component', () => {
    afterEach(() => {
        // Clear the document
        for(let i = 0; i < document.body.children.length; i++) {
            document.body.children.item(i).remove();
        }
    });

    it('should init', () => {
        const component = new MockComponent('template');

        expect(component).toBeTruthy();
    });

    it('should append to document body if parent is not provided', () => {
        const component = new MockComponent('template');

        component.append();

        expect(component.parent).toEqual(document.body);
        expect(component.isLoaded).toBeTruthy();
        expect(component.isVisible).toBeTruthy();
        expect(component.element).toBeTruthy();
    });

    it('should append to parent', () => {
        const component = new MockComponent('template');
        const mockParent = document.createElement('parent');
        document.body.appendChild(mockParent);

        component.append(mockParent);

        expect(component.parent).toEqual(mockParent);
        const template = document.getElementById(component.id);
        expect(template.innerHTML).toEqual(component.template);
    });

    it('should append children', () => {
        const parent = new MockComponent('parent template');
        const child = new MockComponent('child template');
        parent.children = [child];

        parent.append();

        const childNode = document.getElementById(child.id);
        expect(childNode.innerHTML).toEqual(child.template);
    });
});

class MockComponent extends Component {
    constructor(template: string) {
        super(template);
    }
}
