import { createDecoratorWithOption, decorateStorage } from './decorator';

const StoageMetadataKey = "StoageMetadataKey";
const StoageCallbackIOCFactoryKey = "StoageCallbackIOCFactoryKey";
const StorageConcreteClassKey = "StorageConcreteClassKey";

var context: Window & { Reflect: { metadata: (k: string, v: any[]) => any, decorate: (decorators, target, key, desc) => any } } = window as any;
context.Reflect = context.Reflect || <any>{};
context.Reflect.metadata = (k, v) => {
    return function (target: Function, key) {
        decorateStorage(target, key).get(StoageMetadataKey).set(k, v);
    };
};

class Container {
    createService<T>(target: Function & { prototype: T }): T
    createService<T>(target: Function & { prototype: T }, context): T
    createService<T>(target: Function & { prototype: T }, context, contextCreator): T
    createService<T>(target: Function & { prototype: T }, context?, contextCreator?): T {
        var trgt: any = target;
        var builder = decorateStorage(target).get(StoageCallbackIOCFactoryKey).get("builder");
        return builder && builder(this, trgt, context || {}, contextCreator || {}) || new trgt();
    }
}

declare type CallbackIOCFactory = <T>(container: Container, target: Function & { prototype: T }, context, contextCreator) => T;
var factoryDecorator = createDecoratorWithOption((option: CallbackIOCFactory, target) => {
    decorateStorage(target).get(StoageCallbackIOCFactoryKey).set("builder", option);
});

declare type CallbackInjectorFactory<TKey> = {
    key: Function & { prototype: TKey },
    callback: <T>(container, target: Function & { prototype: TKey }, context, contextCreator) => T
};
var injectorDecorator = createDecoratorWithOption((option: CallbackInjectorFactory<any>, target) => {
    factoryDecorator((container, targetKey, context, contextCreator) => {
        var param = (decorateStorage(target).get(StoageMetadataKey).get("design:paramtypes") || [])
            .map((type) => option.callback(container, type, context, contextCreator));

        var instance = target ?
            (param.length <= 0 ?
                new (<any>target)() :
                new (target.bind.apply(target, [null].concat(param)))()
            ) : undefined;

        return instance;
    })(option.key, null, null);
});

var serviceDecorator = <TKey>(options: { key: Function & { prototype: TKey } }) => (target) => {
    decorateStorage(options.key).get(StorageConcreteClassKey).set("value", target);
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

var getConcreteClass = (target: Function) => {
    return target && decorateStorage(target).get(StorageConcreteClassKey).get("value");
}

export {
    serviceDecorator as Service,
    getConcreteClass,
    Container
}