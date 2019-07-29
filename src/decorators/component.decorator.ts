export function ViviDecorator(): ClassDecorator {
    return function<T>(target: any): void | T {
        if (!target.prototype) { return; }
        const ogConstructor = target.prototype.constructor;
        target.prototype.constructor = function (...args) {
            // Apply original constructor
            ogConstructor.apply(this, args);
        }
    }
}