import { EventTypes } from './';

export class Listener {
    constructor(
        private type: string,
        private element: HTMLElement,
        private callback: (event: Event | FocusEvent | MouseEvent | KeyboardEvent) => any,
        private options?: boolean | AddEventListenerOptions
    ) {
        /* Custom Event Types */

        // Enter
        if (type === EventTypes.enter) {
            this.type = EventTypes.keypress;
            const ogFn = this.callback;
            this.callback = (event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                    ogFn(event);
                }
            }
        }

        // Others
        
        if (this.element) this.add();
    }

    add() {
        if (!this.element) throw 'No element found to add listener to';
        this.element.addEventListener(this.type, this.callback, this.options);
    }

    remove() {
        if (!this.element) throw 'No element found to remove listener from';
        this.element.removeEventListener(this.type, this.callback, this.options);
    }
}