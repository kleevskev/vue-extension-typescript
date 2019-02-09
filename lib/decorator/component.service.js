(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./component", "core/dependency-injection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const component_1 = require("./component");
    const dependency_injection_1 = require("core/dependency-injection");
    function ComponentService(options) {
        return (target, metadata) => {
            target = component_1.Component(Object.assign({}, options, {
                provider: (t) => dependency_injection_1.serviceProvider.createService(t)
            }))(target) || target;
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
    exports.ComponentService = ComponentService;
});
