import { setVueOptions } from 'core/option';
export let computed = <T>(target: any, propertyKey: string) => {
    return setVueOptions(target, () => {
        var options = {
            computed: {}
        };
        options.computed[propertyKey] = function () {
            return this._data[propertyKey].apply(this._data, arguments);
        }

        return options;
    });
}