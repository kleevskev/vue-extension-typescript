import { setVueOptions } from 'core/option';
export let methods = <T>(target: any, propertyKey: string) => {
    setVueOptions(target, () => {
        var options = {
            methods: {}
        }
        options.methods[propertyKey] = function () {
            return this._data[propertyKey].apply(this._data, arguments);
        }
        return options;
    });
}