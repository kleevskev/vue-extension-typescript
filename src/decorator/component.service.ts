import { Component } from './component';
import { ServiceDecorator, serviceProvider } from 'core/dependency-injection';

export function ComponentService(options: {
    name: string,
    html: string | Promise<string>
}) {
    return <T>(target: new (...arg) => T, metadata?) => { 
        target = Component<T>(Object.assign({}, options, {
            provider: (t) => serviceProvider.createService(t)
        }))(target) || target;
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