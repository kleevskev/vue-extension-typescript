(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "core/option"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const option_1 = require("core/option");
    exports.methods = (target, propertyKey) => {
        option_1.setVueOptions(target, "methods", (method) => {
            method[propertyKey] = function () {
                return this.$data[propertyKey].apply(this.$data, arguments);
            };
        });
    };
});
