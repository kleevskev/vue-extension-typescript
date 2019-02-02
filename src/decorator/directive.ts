import { Directive as DirectiveRegister } from 'core/directive';

export function Directive<T>(options: {
    name: string
}) {
    var name = options.name;
    return <T>(target: new (...arg) => T) => DirectiveRegister(name, target);
}