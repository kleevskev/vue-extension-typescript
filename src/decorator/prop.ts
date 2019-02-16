import { setVueOptions } from 'core/option';

export function props<T>(target: { name: string })
export function props<T>(target: any, propertyKey: string)
export function props<T>(target: any, propertyKey?: string) {
	var options = arguments.length <= 1 ? target : { name: propertyKey };
	var callback = (target: any, propertyKey: string) => setVueOptions(target, () => {
		var option = {
			props: [options.name],
			watch: {},
			initAfter: [($vuejs) => {
				$vuejs._data[propertyKey] = $vuejs[options.name] !== undefined && $vuejs[options.name] || $vuejs._data[propertyKey];
			}]
		};
		
		if (options.name !== propertyKey) {
			option.watch[options.name] = function (value, oldValue) {
				this._data[propertyKey] = value;
			};

			return option;
		}
    });
	
	if (arguments.length <= 1) {
		return callback;
	} else {
		return callback(target, propertyKey);
	}
}