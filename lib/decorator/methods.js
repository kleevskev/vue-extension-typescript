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
    function methods(target, propertyKey) {
        var option = typeof (target) === "string" ? target : null;
        var callback = (target, propertyKey) => option_1.setVueOptions(target, () => {
            var options = {
                methods: {}
            };
            options.methods[option || propertyKey] = function () {
                return this._data.instance_extension_vuejs[propertyKey].apply(this._data.instance_extension_vuejs, arguments);
            };
            return options;
        });
        if (option) {
            return callback;
        }
        else {
            return callback(target, propertyKey);
        }
    }
    exports.methods = methods;
});
