import { EventTypes } from '@event/event-types.static';

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

        this.add();
    }

    add() {
        this.element.addEventListener(this.type, this.callback, this.options);
    }

    remove() {
        this.element.removeEventListener(this.type, this.callback, this.options);
    }
}