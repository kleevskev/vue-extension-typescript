import { setVueOptions } from 'core/option';

export function computed<T>(target: any)
export function computed<T>(target: any, propertyKey: string)
export function computed<T>(target: any, propertyKey?: string) {
	var option = typeof(target) === "string" ? target : null;
	var callback = (target: any, propertyKey: string) => setVueOptions(target, () => {
        var options = {
            computed: {}
        };
        options.computed[option || propertyKey] = function () {
            return this._data[propertyKey].apply(this._data, arguments);
        }

        return options;
    });
	
	if (option) {
		return callback;
	} else {
		return callback(target, propertyKey);
	}
}