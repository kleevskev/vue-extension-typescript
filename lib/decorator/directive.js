(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "core/directive", "core/dependency-injection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const directive_1 = require("core/directive");
    const dependency_injection_1 = require("core/dependency-injection");
    function Directive(options) {
        var name = options.name;
        return (target, metadata) => {
            var classTarget = target;
            while (classTarget && classTarget.constructor !== classTarget) {
                dependency_injection_1.ServiceDecorator({
                    key: classTarget,
                    cachable: false
                })(target, metadata);
                classTarget = Object.getPrototypeOf(classTarget);
            }
            directive_1.Directive(name, dependency_injection_1.serviceProvider.getService(target));
        };
    }
    exports.Directive = Directive;
});
