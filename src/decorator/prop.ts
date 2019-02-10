import { setVueOptions } from 'core/option';
export let props = (options: { name: string }) => <T>(target: any, propertyKey: string) => {
    setVueOptions(target, () => {
        var option = {
            props: [options.name],
            watch: {},
            initAfter: [($vuejs) => {
                $vuejs._data[propertyKey] = $vuejs[options.name] !== undefined && $vuejs[options.name] || $vuejs._data[propertyKey];
            }]
        };

        option.watch[options.name] = function (value, oldValue) {
            this._data[propertyKey] = value;
        };

        return option;
    });
}