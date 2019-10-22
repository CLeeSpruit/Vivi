import { EventTypes, Listener } from '../';

describe('Class: Listener', () => {
    let listener: Listener;

    afterEach(() => {
        if (listener) {
            try {
                listener.remove();
            } catch (e) {
                // Mmmm intentionally eaten errors
            }
        }
    });

    it('should init', () => {
        const listener = new Listener('test', null, null);

        expect(listener).toBeTruthy();
    });

    describe('add() / remove()', () => {
        it('Add should throw an error if there is no element', () => {
            const listener = new Listener('test', null, null);
            expect(() => { listener.add(); }).toThrowError('No element found to add listener to');
        });

        it('Remove should throw an error if there is no element', () => {
            const listener = new Listener('test', null, null);
            expect(() => { listener.remove(); }).toThrowError('No element found to remove listener from');
        });

        it('Add should add an event listener to the element', () => {
            const element = document.createElement('a');
            const addSpy = spyOn(element, 'addEventListener');
            const listener = new Listener('click', element, null);

            expect(addSpy).toHaveBeenCalledTimes(1);
        });

        it('Remove should remove event listener from the element', () => {
            const element = document.createElement('a');
            const removeSpy = spyOn(element, 'removeEventListener');
            const listener = new Listener('click', element, null);

            listener.remove();
            expect(removeSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Custom Events', () => {
        it('all - should trigger call back on event', (done) => {
            const element = document.createElement('a');
            const listener = new Listener('click', element, () => {
                expect(true).toBeTruthy();
                done();
            });

            element.click();
        });

        describe('keypress', () => {
            it('enter - should trigger call back on keypress:enter', (done) => {
                const element = document.createElement('button');
                const listener = new Listener(EventTypes.enter, element, () => {
                    expect(true).toBeTruthy();
                    done();
                });
                
                element.dispatchEvent(new KeyboardEvent('keypress', { 'key': 'Enter' }));
            });
            
            it('enter - should nto trigger call back on keypress:anything else', () => {
                const element = document.createElement('button');
                const listener = new Listener(EventTypes.enter, element, () => {
                    throw 'If you are seeing this, this test is failing.';
                });
                
                element.dispatchEvent(new KeyboardEvent('keypress', { 'key': 'Shift' }));
            });
        });

        describe('scroll', () => {
            it('scroll up - should trigger call back when mouse scrolls up', (done) => {
                const element = document.createElement('div');
                const listener = new Listener(EventTypes.scrollUp, element, () => {
                    expect(true).toBeTruthy();
                    done();
                });
                
                element.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }));
            });

            it('scroll down - should trigger call back when mouse scrolls up', (done) => {
                const element = document.createElement('div');
                const listener = new Listener(EventTypes.scrollDown, element, () => {
                    expect(true).toBeTruthy();
                    done();
                });
                
                element.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
            });
        });
    });
});