(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./view", "core/dependency-injection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const view_1 = require("./view");
    const dependency_injection_1 = require("core/dependency-injection");
    function ViewService(options) {
        return (target, metadata) => {
            target = view_1.View(options)(target) || target;
            var classTarget = target;
            while (classTarget && classTarget.constructor !== classTarget) {
                dependency_injection_1.ServiceDecorator({
                    key: classTarget,
                    cachable: false
                })(target, metadata);
                classTarget = Object.getPrototypeOf(classTarget);
            }
            return target;
        };
    }
    exports.ViewService = ViewService;
});
