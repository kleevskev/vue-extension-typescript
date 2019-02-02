import { setVueOptions } from 'core/option';
export let computed = <T>(target: any, propertyKey: string) => {
    return setVueOptions(target, "computed", (computed) => {
        computed[propertyKey] = function () {
            return this.$data[propertyKey].apply(this.$data, arguments);
        }
    });
}