import { Component } from '../';

describe('Class: Component', () => {
    it('should init', () => {
        const component = new MockComponent('test', 'template');

        expect(component).toBeTruthy();
    });

    it('should append to document body if parent is not provided', () => {
        const component = new MockComponent('test', 'template');

        component.append();

        expect(component.parent).toEqual(document.body);
        expect(component.isLoaded).toBeTruthy();
        expect(component.isVisible).toBeTruthy();
        expect(component.element).toBeTruthy();
    });

    it('should append to parent', () => {
        const component = new MockComponent('test', 'template');
        const mockParent = document.createElement('parent');

        component.append(mockParent);

        expect(component.parent).toEqual(mockParent);
        const template = document.getElementById(component.id);
        expect(template.innerHTML).toEqual(component.template);
    });

    it('should append children', () => {
        const parent = new MockComponent('parent', 'parent template');
        const child = new MockComponent('child', 'child template');
        parent.children = [child];

        parent.append();

        const childNode = document.getElementById(child.id);
        expect(childNode.innerHTML).toEqual(child.template);
    });
});

class MockComponent extends Component {
    constructor(id: string, template: string) {
        super(id, template);
    }
}
