export function extendClass(target, before: (instance) => void, after: (instance) => void) {
    var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(
        function (instance, args) {
            before && before(this);
            var instance = target.apply(instance, args) || instance;
            after && after(instance);
            return instance;
        });
    Object.setPrototypeOf(result, target);
    function __() { this.constructor = result; }
    result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
    return result;
}