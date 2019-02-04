import { Directive as DirectiveRegister } from 'core/directive';
import { ServiceDecorator, serviceProvider } from 'core/dependency-injection';

export function Directive<T>(options: {
    name: string
}) {
    var name = options.name;
    return <T>(target: new (...arg) => T, metadata?) => { 
        var classTarget = target;
        while(classTarget && classTarget.constructor !== classTarget) {
            (<any>ServiceDecorator({
                key: classTarget,
                cachable: false
            }))(target, metadata);
            classTarget = Object.getPrototypeOf(classTarget);
        }

        DirectiveRegister(name, serviceProvider.getService(target));
    }
}