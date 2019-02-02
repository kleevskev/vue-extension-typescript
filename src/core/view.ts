import { createElement, getAllFuncs, alreadyMap } from './tools';
import { methods } from '../decorator/methods';

declare let Vue;
let _register: IRegister;

export interface IRegister {
    add<TInstance, TClass extends new (...arg) => TInstance>(target: TClass, initialize: (instance: TInstance)=>void) : void;
}

export let View = <T>(htmlPromise: Promise<string>, target: new (...arg) => T, options: any) => {
    var html = htmlPromise;
    var funcs = getAllFuncs(target.prototype);
    funcs.filter(name => !alreadyMap(options, name)).forEach(name => methods(target.prototype, name));
    _register.add<T, new (...arg) => T>(target, (instance: T & { $vuejs }) => {
        instance.$vuejs = html.then(template => new Vue(
            Object.assign({}, options, {
                el: createElement(template),
                data: instance
            })));
    });
}

export function config(options: {
    register: IRegister
}) {
    _register = options.register;
}
