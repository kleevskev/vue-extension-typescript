(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "core/option"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const option_1 = require("core/option");
    exports.props = (options) => (target, propertyKey) => {
        option_1.setVueOptions(target, () => {
            var option = {
                props: [options.name],
                watch: {},
                initAfter: [($vuejs) => {
                        $vuejs._data[propertyKey] = $vuejs[options.name] !== undefined && $vuejs[options.name] || $vuejs._data[propertyKey];
                    }]
            };
            option.watch[options.name] = function (value, oldValue) {
                this._data[propertyKey] = value;
            };
            return option;
        });
    };
});
