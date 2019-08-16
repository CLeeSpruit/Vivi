export abstract class ComponentParams {
    constructor(obj?: Object) {
        if (obj) {
            Object.keys(obj).forEach(key => {
                this[key] = obj[key];
            });
        }
    }
}