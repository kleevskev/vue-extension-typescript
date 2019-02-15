import { createElement, getAllFuncs, alreadyMap, getComputedFromData } from './tools';

declare let Vue;

export let Component = <TClass extends new (...arg) => TInstance, TInstance>(name: string, htmlPromise: Promise<string>, target: TClass, options: any) : TClass => {
	options = options || {};
	options.methods = options.methods || {};
	options.computed = options.computed || {};
    var html = htmlPromise;
    var funcs = getAllFuncs(target.prototype);
    funcs.filter(name => !alreadyMap(options, name)).forEach(name => {
		options.methods[name] = function () {
            return this.$data[name].apply(this._data.instance_extension_vuejs, arguments);
        }
    });
    
    Vue.component(`vc-${name}`, (resolve, reject) => 
        html
        .then(template => resolve(Object.assign({}, options, { 
            template: template,
            data: function () {
                var data = options.data();
				var computed = getComputedFromData(data);
				options.computed = Object.assign({}, computed, options.computed);
                data.$vuejs = Promise.resolve(this);
                data.$vuejs.then(_ => options.initAfter && options.initAfter.forEach(fn => fn(_)));
                return { instance_extension_vuejs: data };
            } 
        })))
        .catch(_ => reject(_))
    );

    return target;
}
