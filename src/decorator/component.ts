import { Component as ComponentRegister } from 'core/component';
import { getVueOptions } from 'core/option';

export function Component<T>(options: {
    name: string,
    html: string | Promise<string>,
    provider?: (target: new (...arg) => T) => T
}) {
    var html = options.html && ((<Promise<string>>options.html).then && options.html || Promise.resolve(options.html));
    var provider = options.provider;
    return (target: new (...arg) => T) => 
        target = ComponentRegister(options.name, <Promise<string>>html, target, Object.assign({}, getVueOptions(target), {
            data: () => provider && provider(target) || new target()
        })) || target;
}