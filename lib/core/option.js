(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./tools"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tools_1 = require("./tools");
    let options = [];
    function getVueOptions(target) {
        return options.filter(_ => _.target === target.prototype).map(_ => _.value)[0];
    }
    exports.getVueOptions = getVueOptions;
    function setVueOptions(target, callback) {
        if (options.filter(_ => _.target === target)[0] == undefined) {
            options.push({ target: target, value: {} });
        }
        options.filter(_ => _.target === target).forEach(option => {
            var opt = callback();
            option.value = opt && tools_1.deepMerge(option.value, opt) || option.value;
        });
    }
    exports.setVueOptions = setVueOptions;
});
