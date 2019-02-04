(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "core/dependency-injection", "decorator/view.service", "decorator/computed", "decorator/methods", "decorator/directive", "core/dependency-injection", "directive/view.directive"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const dependency_injection_1 = require("core/dependency-injection");
    var view_service_1 = require("decorator/view.service");
    exports.View = view_service_1.ViewService;
    var computed_1 = require("decorator/computed");
    exports.computed = computed_1.computed;
    var methods_1 = require("decorator/methods");
    exports.methods = methods_1.methods;
    var directive_1 = require("decorator/directive");
    exports.Directive = directive_1.Directive;
    var dependency_injection_2 = require("core/dependency-injection");
    exports.Service = dependency_injection_2.ServiceDecorator;
    exports.IServiceProvider = dependency_injection_2.IProvider;
    require("directive/view.directive");
    function start(target, element) {
        dependency_injection_1.serviceProvider.createService(target).$vuejs.then(_ => element.appendChild(_.$el));
    }
    exports.start = start;
});
