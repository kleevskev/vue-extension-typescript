import { createElement, getAllFuncs, alreadyMap, getComputedFromData } from './tools';

declare let Vue;

export let View = <TClass extends new (...arg) => TInstance, TInstance>(htmlPromise: Promise<string>, target: TClass, options: any) : TClass => {
	options = options || {};
	options.methods = options.methods || {};
    var html = htmlPromise;
    var funcs = getAllFuncs(target.prototype);
    funcs.filter(name => !alreadyMap(options, name)).forEach(name => {
		options.methods[name] = function () {
            return this.$data[name].apply(this._data.instance_extension_vuejs, arguments);
        }
	});
 
    var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(
        function (instance, args) {
            var instance = target.apply(instance, args) || instance;
			var computed = getComputedFromData(instance);
			options.computed = options.computed || {};
			options.computed = Object.assign({}, computed, options.computed);
            instance.$vuejs = html.then(template => new Vue(Object.assign({}, options, {
                el: createElement(template),
                data: { instance_extension_vuejs: instance }
            })));
            instance.$vuejs.then(_ => options.initAfter && options.initAfter.forEach(fn => fn(_)));
        });
    Object.setPrototypeOf(result, target);
    function __() { this.constructor = result; }
    result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
    return result;
}
