declare let Vue;

export let Directive = (name: string, instance: any) => {
    Vue.directive(name, {
        bind: instance.bind && instance.bind.bind(instance),
        inserted: instance.inserted && instance.inserted.bind(instance),
        update: instance.update && instance.update.bind(instance),
        componentUpdated: instance.componentUpdated && instance.componentUpdated.bind(instance),
        unbind: instance.unbind && instance.unbind.bind(instance)
    });
}