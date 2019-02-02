declare let Vue;

let _factory: IFactory;

export interface IFactory {
    create<TInstance, TClass extends new (...arg) => TInstance>(target: TClass) : TInstance;
}

export let Directive = <T>(name: string, target: new (...arg) => T) => {
    var instance = _factory.create<any,any>(target);
    Vue.directive(name, {
        bind: instance.bind && instance.bind.bind(instance),
        inserted: instance.inserted && instance.inserted.bind(instance),
        update: instance.update && instance.update.bind(instance),
        componentUpdated: instance.componentUpdated && instance.componentUpdated.bind(instance),
        unbind: instance.unbind && instance.unbind.bind(instance)
    });
}

export function config(options: {
    factory: IFactory
}) {
    _factory = options.factory;
}