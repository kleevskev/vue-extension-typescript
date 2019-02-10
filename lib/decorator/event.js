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
    exports.event = (options) => (target, propertyKey, descriptor) => {
        var eventType = options.name;
        option_1.setVueOptions(target, () => {
            var base = descriptor.value;
            descriptor.value = function () {
                var result = base.apply(this, arguments);
                this.$vuejs.then(vuejs => vuejs.$emit(eventType, result));
                return result;
            };
        });
    };
});
