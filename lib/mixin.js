(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function extendClass(target, before, after) {
        var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(function (instance, args) {
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
    exports.extendClass = extendClass;
});
