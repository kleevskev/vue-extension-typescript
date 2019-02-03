import { View as ViewRegister } from 'core/view';
import { getVueOptions } from 'core/option';

export function View(options: {
    html: string | Promise<string>
}) {
    var html = options.html && ((<Promise<string>>options.html).then && options.html || Promise.resolve(options.html));
    return <T>(target: new (...arg) => T) => ViewRegister(<Promise<string>>html, target, getVueOptions(target));
}