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
    function createDecoratorWithDefaultOption(callback) {
        return (defaultOption) => {
            var result = (target, key, desc) => {
                if (target.constructor.prototype !== target) {
                    return callback.bind(null, target);
                }
                else {
                    return callback(defaultOption(target, key, desc), target, key, desc);
                }
            };
            return result;
        };
    }
    exports.createDecoratorWithDefaultOption = createDecoratorWithDefaultOption;
    function createDecoratorWithOption(callback) {
        return (options) => {
            return callback.bind(null, options);
        };
    }
    exports.createDecoratorWithOption = createDecoratorWithOption;
    function createDecorator(callback) {
        return callback;
    }
    exports.createDecorator = createDecorator;
    function decorateStorage(target, key) {
        var storage;
        var trgt = target;
        key = key || "$root$";
        trgt.$$decorateStorage$$ = trgt.$$decorateStorage$$ || {};
        storage = (trgt.$$decorateStorage$$[key] = trgt.$$decorateStorage$$[key] || {});
        return {
            get: (key) => {
                var obj = storage[key] = storage[key] || {};
                return {
                    set: (key, value) => {
                        obj[key] = obj[key] || {};
                        obj[key] = value;
                    },
                    get: (key) => obj && obj[key],
                    getAll: () => obj
                };
            }
        };
    }
    exports.decorateStorage = decorateStorage;
});
