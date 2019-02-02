(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let options = [];
    function getVueOptions(target) {
        return options.filter(_ => _.target === target.prototype).map(_ => _.value)[0];
    }
    exports.getVueOptions = getVueOptions;
    function setVueOptions(target, name, callback) {
        if (options.filter(_ => _.target === target)[0] == undefined) {
            options.push({ target: target, value: {} });
        }
        options.filter(_ => _.target === target).map(_ => _.value).forEach(option => {
            option[name] = option[name] || {};
            option[name] = callback(option[name]) || option[name];
        });
    }
    exports.setVueOptions = setVueOptions;
});
