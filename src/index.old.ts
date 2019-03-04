declare let Vue: any;

var context: Window & { Reflect: { metadata: (k: string, v: any[]) => any, decorate: (decorators, target, key, desc) => any } } = window as any;
context.Reflect = context.Reflect || <any>{}; 
context.Reflect.metadata = (k, v) => {
    return function (target) {
        target.$$ioc = target.$$ioc || {};
        target.$$ioc.metadata = {};
        target.$$ioc.metadata[k] = v;
    };
};

var explorePrototype = (target, callback: (target) => void) => {
    var classTarget = Object.getPrototypeOf(target);
    while(classTarget && classTarget.constructor !== classTarget) {
        callback(classTarget.constructor);
        classTarget = Object.getPrototypeOf(classTarget);
    }
}

class Container {
    createService<T>(target: Function & { prototype: T }): T 
    createService<T>(target: Function & { prototype: T }, context): T 
    createService<T>(target: Function & { prototype: T }, context?): T {
        var trgt:any = target;
        return trgt.$$ioc && trgt.$$ioc.builder && trgt.$$ioc.builder(this, trgt, context || {}) || new trgt();
    }
}

var factoryDecorator = (callback: <T>(container: Container, target: Function & { prototype: T }, context)=>T) => (target) => {
    target.$$ioc = target.$$ioc || {};
    target.$$ioc.builder = callback;
}

var injectorDecorator = <TKey>(options: { 
    key: { prototype: TKey }, 
    callback: <T>(container, target: { prototype: TKey }, context) => T
}) => (target) => {
    return factoryDecorator((container, key, context) => {
        var trgt: any = target;
        var param = (trgt.$$ioc && trgt.$$ioc.metadata && trgt.$$ioc.metadata["design:paramtypes"] || [])
            .map((type) => options.callback(container, type, context));

	    var instance = trgt ? 
			(param.length <= 0 ? 
				new trgt() : 
				new (trgt.bind.apply(trgt, [null].concat(param)))()
            ): undefined;
            
        return instance;
    })(options.key);
}

var serviceDecorator = <TKey>(options: { key: { prototype: TKey } }) => injectorDecorator({
    key: options.key,
    callback: (container, type, context) => { 
        context.created = context.created || [];
        var result = context.created.filter(_ => _.key === type).map(_ => _.value)[0];
        if (!result) {
            result = container.createService(type, context);
            context.created.push({ key: type, value: result });
        }

        return result;
    }
});

var dataDecorator = (targetPrototype, key, desc?) => {
    var desc = desc || {};
    var getter = desc && desc.get;
    var setter = desc && desc.set;
    desc.get = function () {
		var value = getter ? getter.apply(this, arguments) : this.$vuedata.zyx123values[key];
		if (value !== this.$vuedata.zyx123values[key]) {
			this.$vuedata.zyx123values[key] = value;
		}
		
        return value;
    }
    desc.set = function () {
        setter && setter.apply(this, arguments);
        this.$vuedata.zyx123values[key] = setter ? this[key] : arguments[0];
    }
	
	init(data => {
		data.zyx123values = data.zyx123values || {};
        data.zyx123values[key] = data.$$targetInstance[key] != undefined ? data.$$targetInstance[key] : null; 
	})(targetPrototype);
	
	beforeMount(vueInstance => { 
		var descriptor: any = {};
		descriptor.set = function () { 
			vueInstance.$data.$$targetInstance[key] = arguments[0];
		}
		descriptor.get = function () { 
			return vueInstance.$data.zyx123values[key];
		}
		Object.defineProperty(vueInstance, key, descriptor);
	})(targetPrototype);

	decorate(targetPrototype, key);
    return desc;
}

var decorate = (targetPrototype, key) => {
	targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
	targetPrototype.$$vuejsext.decorate = targetPrototype.$$vuejsext.decorate || {};
	targetPrototype.$$vuejsext.decorate[key] = true;
}

var isDecorate = (targetPrototype, key) => targetPrototype.$$vuejsext && targetPrototype.$$vuejsext.decorate && targetPrototype.$$vuejsext.decorate[key];

var init = (callback: (data) => void) => (targetPrototype) => {
	targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.init = targetPrototype.$$vuejsext.init || [];
    targetPrototype.$$vuejsext.init.push(callback);
}

var beforeMount = (callback: (vueInstance) => void) => (targetPrototype) => {
	targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.beforeMount = targetPrototype.$$vuejsext.beforeMount || [];
    targetPrototype.$$vuejsext.beforeMount.push(callback);
}

var computedDecorator = (targetPrototype, key) => {
	decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.computed = targetPrototype.$$vuejsext.computed || {};
    targetPrototype.$$vuejsext.computed[key] = function () { 
        return this.$data.$$targetInstance[key];
    }
}

var watchDecorator = (name: string) => (targetPrototype, key, desc) => {
	decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.watch = targetPrototype.$$vuejsext.watch || {};
    targetPrototype.$$vuejsext.watch[`zyx123values.${name}`] = function () { 
        this.$data.$$targetInstance[key]();
    }
}

var methodDecorator = (targetPrototype, key, desc) => {
	decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.methods = targetPrototype.$$vuejsext.methods || {};
    targetPrototype.$$vuejsext.methods[key] = function () { 
        this.$data.$$targetInstance[key].apply(this.$data.$$targetInstance, arguments);
    }
}

var eventDecorator = (targetPrototype, key, desc) => {
	decorate(targetPrototype, key);
    methodDecorator(targetPrototype, key, desc);
    var _super = desc.value;
    desc.value = function() {
        var result = _super.apply(this, arguments);
        this.$vuedata.$vuejs && this.$vuedata.$vuejs.then(vuejs => vuejs.$emit(key, result));
        return result;
    }
}

var propDecorator = (targetPrototype, key, desc?) => {
    var desc = desc || {};
    var setter = desc && desc.set;
    desc.set = function () {
        setter && setter.apply(this, arguments);
        // this[key] !== arguments[0] && (this[key] = arguments[0]);
    }
	decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.props = targetPrototype.$$vuejsext.props || {};
    targetPrototype.$$vuejsext.props[key] = {};
	return desc;
}

var setDefaultConfig = (target) => {
	var targetPrototype = target.prototype;
    Object.keys(targetPrototype)
        .filter(key => key.indexOf("$") !== 0)
        .forEach(key => {
            if (!isDecorate(targetPrototype, key)) {
                var descriptor = Object.getOwnPropertyDescriptor(targetPrototype, key);
                if (descriptor.get && descriptor.set) {
                    Object.defineProperty(targetPrototype, key, dataDecorator(targetPrototype, key, descriptor));
                } else if (descriptor.set) {
                    Object.defineProperty(targetPrototype, key, propDecorator(targetPrototype, key, descriptor));
                } else if (descriptor.get) {
                    computedDecorator(targetPrototype, key);
                }
            }
	});
}

var GetVueConfig = (options: {el?: string; name?: string; html: Promise<string>}) => (target) => {
	setDefaultConfig(target);
    target.prototype.$$vuejsext = target.prototype.$$vuejsext || {};
    var data = target.prototype.$$vuejsext.data || {};
    var computed = target.prototype.$$vuejsext.computed || {};
    var watch: any = target.prototype.$$vuejsext.watch || {};
    var props  = target.prototype.$$vuejsext.props || {};
    var methods  = target.prototype.$$vuejsext.methods || {};
    var html = options.html;
    var el = options.el;
	var inits  = target.prototype.$$vuejsext.init || [];
	var beforeMounts  = target.prototype.$$vuejsext.beforeMount || [];
    var initValues = (d) => inits.forEach((fn) => fn(d));
    var beforeMount = function () { beforeMounts.forEach((fn) => fn(this)); }

    return {
        data: data,
        computed: computed,
        watch: watch,
        props: props,
        methods: methods,
        html: html,
        el: el,
        initValues: initValues,
        beforeMount: beforeMount,
        setVueInstance: (d, vi: Promise<any>) => d.$vuejs = vi
    };
}

var vueInjectorDecorator = (target) => explorePrototype(target, (prototypeClass) => {
    injectorDecorator({
        key: prototypeClass,
        callback: (container, type: any, context) => { 
            context.created = context.created || [];
            var result = context.created.filter(_ => _.key === type).map(_ => _.value)[0];
            if (!result) {
                if (type && type.$$vuejs && type.$$vuejs.isComponent) {

                } else if (type && type.$$vuejs && type.$$vuejs.isVue) {
                    result = container.createService(type, context);
                } else {
                    result = container.createService(type, context);
                    context.created.push({ key: type, value: result });
                }
            }
    
            return result;
        }
    })(target);
});

var extendClass = (target, init: (instance) => void) => {
    var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(
        function (instance, args) {
            var d:any = { zyx123values: {}};
            d.$$targetInstance = instance;
            instance.$vuedata = d;
            var instance = target.apply(instance, args) || instance;
            init(instance);
        });
    Object.setPrototypeOf(result, target);
    function __() { this.constructor = result; }
    result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
    return result;
}

var ComponentDecorator = (options: {name: string; html: Promise<string>}) => (target) => {
    target.$$vuejs = target.$$vuejs || {};
    target.$$vuejs.isComponent = true;
    var result = extendClass(target, (instance) => {
        config.initValues(instance.$vuedata);
    });
    vueInjectorDecorator(result);
    
    var config = GetVueConfig(options)(target);
    delete config.el;

    Vue.component(options.name, (resolve) => {
        config.html.then(template => resolve(Object.assign({}, config, {
            template: template,
            data: function () {
                var instance: any = container.createService(result, containerContext);
                config.setVueInstance(instance.$vuedata, Promise.resolve(this));
                return instance.$vuedata;
            }
        })));
    });

    return result;
}

var VueDecorator = (options: {el: string, html: Promise<string>}) => (target) => {
    target.$$vuejs = target.$$vuejs || {};
    target.$$vuejs.isVue = true;
    var result = extendClass(target, (instance) => {
        config.initValues(instance.$vuedata);
        config.setVueInstance(instance.$vuedata, config.html.then(template => new Vue(Object.assign({}, config, {
            el: config.el,
            data: instance.$vuedata,
            template: template
        }))));
    });

    vueInjectorDecorator(result);
    var config = GetVueConfig(options)(target);

    return result;
}

var container = new Container();
var containerContext:any = {};

var DirectiveDecorator = (options: {
    name: string
}) => target => {
    vueInjectorDecorator(target);
    var instance: any = container.createService(target, containerContext);
    Vue.directive(name, {
        bind: instance.bind && instance.bind.bind(instance),
        inserted: instance.inserted && instance.inserted.bind(instance),
        update: instance.update && instance.update.bind(instance),
        componentUpdated: instance.componentUpdated && instance.componentUpdated.bind(instance),
        unbind: instance.unbind && instance.unbind.bind(instance)
    });
}

abstract class IServiceProvider {
    abstract createService<T>(key: Function & { prototype: T }): T;
    abstract getService<T>(type: Function & { prototype: T }): T;
}

@serviceDecorator({ key: IServiceProvider })
class ServiceProvider extends IServiceProvider {
    createService<T>(target: Function & { prototype: T }): T {
        return container.createService(target, containerContext);
    }

    getService<T>(type: Function & { prototype: T }): T {
        containerContext.created = containerContext.created || {};
        return containerContext.created.filter(_ => _.key === type).map(_ => _.value)[0] || this.createService(type);
    }
}

export { 
    VueDecorator as View,
    ComponentDecorator as Component,
    computedDecorator as computed,
    methodDecorator as methods,
    propDecorator as props,
    eventDecorator as event,
    DirectiveDecorator as Directive,
    serviceDecorator as Service,
    dataDecorator as data,
    watchDecorator as watch,
    IServiceProvider
}

export function start(target) {
    container.createService(target, containerContext);
}
