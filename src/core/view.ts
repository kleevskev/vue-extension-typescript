import { createElement, getAllFuncs, alreadyMap } from './tools';
import { methods } from '../decorator/methods';

declare let Vue;

export let View = <TClass extends new (...arg) => TInstance, TInstance>(htmlPromise: Promise<string>, target: TClass, options: any) : TClass => {
    var html = htmlPromise;
    var funcs = getAllFuncs(target.prototype);
    funcs.filter(name => !alreadyMap(options, name)).forEach(name => methods(target.prototype, name));
    var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(
        function (instance, args) {
            var instance = target.apply(instance, args) || instance;
            instance.$vuejs = html.then(template => new Vue(Object.assign({}, options, {
                el: createElement(template),
                data: instance
            })));
        });
    Object.setPrototypeOf(result, target);
    function __() { this.constructor = result; }
    result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
    return result;
}
