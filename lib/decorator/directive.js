(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "core/directive"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const directive_1 = require("core/directive");
    function Directive(options) {
        var name = options.name;
        return (target) => directive_1.Directive(name, target);
    }
    exports.Directive = Directive;
});
