(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "core/view", "core/option"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const view_1 = require("core/view");
    const option_1 = require("core/option");
    function View(options) {
        var html = options.html && (options.html.then && options.html || Promise.resolve(options.html));
        return (target) => view_1.View(html, target, option_1.getVueOptions(target));
    }
    exports.View = View;
});
