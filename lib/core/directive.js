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
    exports.Directive = (name, instance) => {
        Vue.directive(name, {
            bind: instance.bind && instance.bind.bind(instance),
            inserted: instance.inserted && instance.inserted.bind(instance),
            update: instance.update && instance.update.bind(instance),
            componentUpdated: instance.componentUpdated && instance.componentUpdated.bind(instance),
            unbind: instance.unbind && instance.unbind.bind(instance)
        });
    };
});
