import { setVueOptions } from 'core/option';
export let methods = <T>(target: any, propertyKey: string) => {
    setVueOptions(target, "methods", (method) => {
        method[propertyKey] = function () {
            return this.$data[propertyKey].apply(this.$data, arguments);
        }
    });
}