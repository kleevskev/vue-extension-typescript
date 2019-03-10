(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./decorator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const decorator_1 = require("./decorator");
    const StoageMetadataKey = "StoageMetadataKey";
    const StoageCallbackIOCFactoryKey = "StoageCallbackIOCFactoryKey";
    const StorageConcreteClassKey = "StorageConcreteClassKey";
    var context = window;
    context.Reflect = context.Reflect || {};
    context.Reflect.metadata = (k, v) => {
        return function (target, key) {
            decorator_1.decorateStorage(target, key).get(StoageMetadataKey).set(k, v);
        };
    };
    class Container {
        createService(target, context, contextCreator) {
            var trgt = target;
            var builder = decorator_1.decorateStorage(target).get(StoageCallbackIOCFactoryKey).get("builder");
            return builder && builder(this, trgt, context || {}, contextCreator || {}) || new trgt();
        }
    }
    exports.Container = Container;
    var factoryDecorator = decorator_1.createDecoratorWithOption((option, target) => {
        decorator_1.decorateStorage(target).get(StoageCallbackIOCFactoryKey).set("builder", option);
    });
    var injectorDecorator = decorator_1.createDecoratorWithOption((option, target) => {
        factoryDecorator((container, targetKey, context, contextCreator) => {
            var param = (decorator_1.decorateStorage(target).get(StoageMetadataKey).get("design:paramtypes") || [])
                .map((type) => option.callback(container, type, context, contextCreator));
            var instance = target ?
                (param.length <= 0 ?
                    new target() :
                    new (target.bind.apply(target, [null].concat(param)))()) : undefined;
            return instance;
        })(option.key, null, null);
    });
    var serviceDecorator = (options) => (target) => {
        decorator_1.decorateStorage(options.key).get(StorageConcreteClassKey).set("value", target);
        injectorDecorator({
            key: options.key,
            callback: (container, type, context) => {
                context.created = context.created || [];
                var result = context.created.filter(_ => _.key === type).map(_ => _.value)[0];
                if (!result) {
                    result = container.createService(type, context);
                    context.created.push({ key: type, value: result });
                }
                return result;
            }
        })(target, null, null);
    };
    exports.Service = serviceDecorator;
    var getConcreteClass = (target) => {
        return target && decorator_1.decorateStorage(target).get(StorageConcreteClassKey).get("value");
    };
    exports.getConcreteClass = getConcreteClass;
});
