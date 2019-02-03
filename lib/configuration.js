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
    // import { IRegister, config as configViewRegister } from 'core/view';
    const directive_1 = require("core/directive");
    const dependency_injection_1 = require("core/dependency-injection");
    // class Register implements IRegister {
    //     add<TInstance, TClass extends new (...arg) => TInstance>(target: TClass, initialize: (instance: TInstance)=>void) {
    //         var classTarget = target;
    //         while(classTarget && classTarget.constructor !== classTarget) {
    //             ServiceDecorator({
    //                 key: classTarget,
    //                 cachable: false,
    //                 initialize: initialize
    //             })(target);
    //             classTarget = Object.getPrototypeOf(classTarget);
    //         }
    //     }
    // }
    class Factory {
        create(target) {
            return dependency_injection_1.serviceProvider.createService(target);
        }
    }
    // configViewRegister({
    //     register: new Register()
    // });
    directive_1.config({
        factory: new Factory()
    });
});
