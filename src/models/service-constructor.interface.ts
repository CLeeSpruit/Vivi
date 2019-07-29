export interface ViviServiceConstructor<T> {
    constructor: new (...args) => T;
    prereqArr?: Array<new (...args) => any>;
}
