import { createElement, getAllFuncs, alreadyMap } from './tools';
import { methods } from '../decorator/methods';

declare let Vue;

export let View = <TClass extends new (...arg) => TInstance, TInstance>(htmlPromise: Promise<string>, target: TClass, options: any) : TClass => {
    var html = htmlPromise;
    var funcs = getAllFuncs(target.prototype);
    funcs.filter(name => !alreadyMap(options, name)).forEach(name => methods(target.prototype, name));
    var result = (new Function('target', `var ${target.name} = target(); return ${target.name};`))(() => {
        return  function() {
            var instance = target.apply(this, arguments) || this;
            instance.$vuejs = html.then(template => new Vue(Object.assign({}, options, {
                el: createElement(template),
                data: instance
            })));
        };
    });
    
    result.prototype = target.prototype;
    return result;
}
