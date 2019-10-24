export abstract class ComponentParams extends Object {
    constructor(obj?: Object) {
        super();
        if (obj) {
            Object.keys(obj).forEach(key => {
                this[key] = obj[key];
            });
        }
    }
}