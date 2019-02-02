(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "core/view", "core/directive", "core/dependency-injection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const view_1 = require("core/view");
    const directive_1 = require("core/directive");
    const dependency_injection_1 = require("core/dependency-injection");
    class Register {
        add(target, initialize) {
            var classTarget = target;
            while (classTarget && classTarget.constructor !== classTarget) {
                dependency_injection_1.ServiceDecorator({
                    key: classTarget,
                    registerable: false,
                    initialize: initialize
                })(target);
                classTarget = Object.getPrototypeOf(classTarget);
            }
        }
    }
    class Factory {
        create(target) {
            return dependency_injection_1.serviceProvider.createService(target);
        }
    }
    view_1.config({
        register: new Register()
    });
    directive_1.config({
        factory: new Factory()
    });
});
