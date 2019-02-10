import { setVueOptions } from 'core/option';
export let event = (options: { name: string }) => <T>(target: any, propertyKey: string, descriptor) => {
    var eventType = options.name;
    setVueOptions(target, () => {
        var base = descriptor.value;
        descriptor.value = function () {
            var result = base.apply(this, arguments);
            this.$vuejs.then(vuejs => vuejs.$emit(eventType, result));
            return result;
        };
    });
}