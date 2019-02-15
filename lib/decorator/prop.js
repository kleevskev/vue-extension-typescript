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
    function props(target, propertyKey) {
        var options = arguments.length <= 1 ? target : { name: propertyKey };
        var callback = (target, propertyKey) => option_1.setVueOptions(target, () => {
            var option = {
                props: [options.name],
                watch: {},
                initAfter: [($vuejs) => {
                        $vuejs._data.instance_extension_vuejs[propertyKey] = $vuejs[options.name] !== undefined && $vuejs[options.name] || $vuejs._data.instance_extension_vuejs[propertyKey];
                    }]
            };
            if (options.name !== propertyKey) {
                option.watch[options.name] = function (value, oldValue) {
                    this._data.instance_extension_vuejs[propertyKey] = value;
                };
            }
            return option;
        });
        if (arguments.length <= 1) {
            return callback;
        }
        else {
            return callback(target, propertyKey);
        }
    }
    exports.props = props;
});
