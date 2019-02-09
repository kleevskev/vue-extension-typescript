(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "core/component", "core/option"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const component_1 = require("core/component");
    const option_1 = require("core/option");
    function Component(options) {
        var html = options.html && (options.html.then && options.html || Promise.resolve(options.html));
        var provider = options.provider;
        return (target) => target = component_1.Component(options.name, html, target, Object.assign({}, option_1.getVueOptions(target), {
            data: () => provider && provider(target) || new target()
        })) || target;
    }
    exports.Component = Component;
});
