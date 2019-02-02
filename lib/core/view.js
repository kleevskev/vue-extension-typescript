(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./tools", "../decorator/methods"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tools_1 = require("./tools");
    const methods_1 = require("../decorator/methods");
    let _register;
    exports.View = (htmlPromise, target, options) => {
        var html = htmlPromise;
        var funcs = tools_1.getAllFuncs(target.prototype);
        funcs.filter(name => !tools_1.alreadyMap(options, name)).forEach(name => methods_1.methods(target.prototype, name));
        _register.add(target, (instance) => {
            instance.$vuejs = html.then(template => new Vue(Object.assign({}, options, {
                el: tools_1.createElement(template),
                data: instance
            })));
        });
    };
    function config(options) {
        _register = options.register;
    }
    exports.config = config;
});
