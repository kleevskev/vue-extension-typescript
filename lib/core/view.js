(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./tools"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tools_1 = require("./tools");
    exports.View = (htmlPromise, target, options) => {
        options = options || {};
        options.methods = options.methods || {};
        var html = htmlPromise;
        var funcs = tools_1.getAllFuncs(target.prototype);
        funcs.filter(name => !tools_1.alreadyMap(options, name)).forEach(name => {
            options.methods[name] = function () {
                return this.$data[name].apply(this.$data, arguments);
            };
        });
        var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(function (instance, args) {
            var instance = target.apply(instance, args) || instance;
            instance.$vuejs = html.then(template => new Vue(Object.assign({}, options, {
                el: tools_1.createElement(template),
                data: instance
            })));
            instance.$vuejs.then(_ => options.initAfter && options.initAfter.forEach(fn => fn(_)));
        });
        Object.setPrototypeOf(result, target);
        function __() { this.constructor = result; }
        result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
        return result;
    };
});
