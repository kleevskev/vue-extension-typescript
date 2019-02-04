import { View } from './view';
import { ServiceDecorator } from 'core/dependency-injection';

export function ViewService(options: {
    html: string | Promise<string>
}) {
    return <T>(target: new (...arg) => T, metadata?) => { 
        target = View(options)(target) || target;
        var classTarget = target;
        while(classTarget && classTarget.constructor !== classTarget) {
            (<any>ServiceDecorator({
                key: classTarget,
                cachable: false
            }))(target, metadata);
            classTarget = Object.getPrototypeOf(classTarget);
        }

        return target;
    }
}