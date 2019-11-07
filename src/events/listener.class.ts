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

        /*
        @todo merge scroll and wheel events
        @body Wheel event only affects the mouse wheel, rather than a scroll bar, however the wheel has the delta property which tells which way to go
        */
        if (type === EventTypes.scrollDown) {
            this.type = EventTypes.wheel;
            const ogFn = this.callback;
            this.callback = (event: WheelEvent) => {
                if (event.deltaY > 0) {
                    ogFn(event);
                }
            }
        }

        if (type === EventTypes.scrollUp) {
            this.type = EventTypes.wheel;
            const ogFn = this.callback;
            this.callback = (event: WheelEvent) => {
                if (event.deltaY < 0) {
                    ogFn(event);
                }
            }
        }

        // Others
        
        if (this.element) this.add();
    }

    add() {
        if (!this.element) return;
        this.element.addEventListener(this.type, this.callback, this.options);
    }

    remove() {
        if (!this.element) return;
        this.element.removeEventListener(this.type, this.callback, this.options);
    }
}