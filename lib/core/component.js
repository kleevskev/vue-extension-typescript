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
    exports.Component = (name, htmlPromise, target, options) => {
        options = options || {};
        options.methods = options.methods || {};
        options.computed = options.computed || {};
        var html = htmlPromise;
        var funcs = tools_1.getAllFuncs(target.prototype);
        funcs.filter(name => !tools_1.alreadyMap(options, name)).forEach(name => {
            options.methods[name] = function () {
                return this.$data[name].apply(this._data, arguments);
            };
        });
        Vue.component(`vc-${name}`, (resolve, reject) => html
            .then(template => resolve(Object.assign({}, options, {
            template: template,
            data: function () {
                var data = options.data();
                data.$vuejs = Promise.resolve(this);
                data.$vuejs.then(_ => options.initAfter && options.initAfter.forEach(fn => fn(_)));
                return data;
            }
        })))
            .catch(_ => reject(_)));
        return target;
    };
});
