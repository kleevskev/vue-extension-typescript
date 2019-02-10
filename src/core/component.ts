import { createElement, getAllFuncs, alreadyMap } from './tools';
import { methods } from '../decorator/methods';

declare let Vue;

export let Component = <TClass extends new (...arg) => TInstance, TInstance>(name: string, htmlPromise: Promise<string>, target: TClass, options: any) : TClass => {
	options = options || {};
	options.methods = options.methods || {};
    var html = htmlPromise;
    var funcs = getAllFuncs(target.prototype);
    funcs.filter(name => !alreadyMap(options, name)).forEach(name => {
		options.methods[name] = function () {
            return this.$data[name].apply(this.$data, arguments);
        }
    });
    
    Vue.component(`vc-${name}`, (resolve, reject) => 
        html
        .then(template => resolve(Object.assign({}, options, { 
            template: template,
            data: function () {
                var data = options.data();
                data.$vuejs = Promise.resolve(this);
                 data.$vuejs.then(_ => options.initAfter && options.initAfter.forEach(fn => fn(_)));
                 return data;
            } 
        })))
        .catch(_ => reject(_))
    );

    return target;
}
