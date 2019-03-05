var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var context = window;
    context.Reflect = context.Reflect || {};
    context.Reflect.metadata = (k, v) => {
        return function (target) {
            target.$$ioc = target.$$ioc || {};
            target.$$ioc.metadata = {};
            target.$$ioc.metadata[k] = v;
        };
    };
    var explorePrototype = (target, callback) => {
        var classTarget = Object.getPrototypeOf(target);
        while (classTarget && classTarget.constructor !== classTarget) {
            callback(classTarget.constructor);
            classTarget = Object.getPrototypeOf(classTarget);
        }
    };
    class Container {
        createService(target, context) {
            var trgt = target;
            return trgt.$$ioc && trgt.$$ioc.builder && trgt.$$ioc.builder(this, trgt, context || {}) || new trgt();
        }
    }
    var factoryDecorator = (callback) => (target) => {
        target.$$ioc = target.$$ioc || {};
        target.$$ioc.builder = callback;
    };
    var injectorDecorator = (options) => (target) => {
        return factoryDecorator((container, key, context) => {
            var trgt = target;
            var param = (trgt.$$ioc && trgt.$$ioc.metadata && trgt.$$ioc.metadata["design:paramtypes"] || [])
                .map((type) => options.callback(container, type, context));
            var instance = trgt ?
                (param.length <= 0 ?
                    new trgt() :
                    new (trgt.bind.apply(trgt, [null].concat(param)))()) : undefined;
            return instance;
        })(options.key);
    };
    var serviceDecorator = (options) => injectorDecorator({
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
    exports.Service = serviceDecorator;
    var dataDecorator = (targetPrototype, key, desc) => {
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.computed = targetPrototype.$$vuejsext.computed || {};
        targetPrototype.$$vuejsext.computed[key] = {
            get: function () {
                return this.$data.zyx123values[key];
            },
            set: function (value) {
                this.$data.zyx123values[key] = value;
            }
        };
        decorate(targetPrototype, key);
    };
    exports.data = dataDecorator;
    var decorate = (targetPrototype, key) => {
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.decorate = targetPrototype.$$vuejsext.decorate || {};
        targetPrototype.$$vuejsext.decorate[key] = true;
    };
    var isDecorate = (targetPrototype, key) => targetPrototype.$$vuejsext && targetPrototype.$$vuejsext.decorate && targetPrototype.$$vuejsext.decorate[key];
    var beforeMount = (callback) => (targetPrototype) => {
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.beforeMount = targetPrototype.$$vuejsext.beforeMount || [];
        targetPrototype.$$vuejsext.beforeMount.push(callback);
    };
    var computedDecorator = (targetPrototype, key) => {
        decorate(targetPrototype, key);
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.computed = targetPrototype.$$vuejsext.computed || {};
        targetPrototype.$$vuejsext.computed[key] = function () {
            return this.$data.zyx123values[key];
        };
    };
    exports.computed = computedDecorator;
    var watchDecorator = (name) => (targetPrototype, key, desc) => {
        decorate(targetPrototype, key);
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.watch = targetPrototype.$$vuejsext.watch || {};
        targetPrototype.$$vuejsext.watch[name] = function () {
            this.$data.zyx123values[key]();
        };
    };
    exports.watch = watchDecorator;
    var methodDecorator = (targetPrototype, key, desc) => {
        decorate(targetPrototype, key);
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.methods = targetPrototype.$$vuejsext.methods || {};
        targetPrototype.$$vuejsext.methods[key] = function () {
            this.$data.zyx123values[key].apply(this.$data.zyx123values, arguments);
        };
    };
    exports.methods = methodDecorator;
    var eventDecorator = (targetPrototype, key, desc) => {
        decorate(targetPrototype, key);
        methodDecorator(targetPrototype, key, desc);
        var _super = desc.value;
        desc.value = function () {
            var result = _super.apply(this, arguments);
            this.$vuejs && this.$vuejs.then(vuejs => vuejs.$emit(key, result));
            return result;
        };
    };
    exports.event = eventDecorator;
    var propDecorator = (targetPrototype, key, desc) => {
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.watch = targetPrototype.$$vuejsext.watch || {};
        targetPrototype.$$vuejsext.watch[key] = function () {
            this.$data.zyx123values[key] = this[key];
        };
        decorate(targetPrototype, key);
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.props = targetPrototype.$$vuejsext.props || {};
        targetPrototype.$$vuejsext.props[key] = {};
    };
    exports.props = propDecorator;
    var setDefaultConfig = (target) => {
        var targetPrototype = target.prototype;
        Object.keys(targetPrototype)
            .filter(key => key.indexOf("$") !== 0)
            .forEach(key => {
            if (!isDecorate(targetPrototype, key)) {
                var descriptor = Object.getOwnPropertyDescriptor(targetPrototype, key);
                if (descriptor.get && descriptor.set) {
                    dataDecorator(targetPrototype, key, descriptor);
                }
                else if (descriptor.set) {
                    propDecorator(targetPrototype, key, descriptor);
                }
                else if (descriptor.get) {
                    computedDecorator(targetPrototype, key);
                }
            }
        });
    };
    var GetVueConfig = (options) => (target) => {
        setDefaultConfig(target);
        target.prototype.$$vuejsext = target.prototype.$$vuejsext || {};
        var data = target.prototype.$$vuejsext.data || {};
        var computed = target.prototype.$$vuejsext.computed || {};
        var watch = target.prototype.$$vuejsext.watch || {};
        var props = target.prototype.$$vuejsext.props || {};
        var methods = target.prototype.$$vuejsext.methods || {};
        var html = options.html;
        var el = options.el;
        var inits = target.prototype.$$vuejsext.init || [];
        var beforeMounts = target.prototype.$$vuejsext.beforeMount || [];
        var initValues = (d) => inits.forEach((fn) => fn(d));
        var beforeMount = function () { beforeMounts.forEach((fn) => fn(this)); };
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
            setVueInstance: (instance, vi) => instance.$vuejs = vi
        };
    };
    var vueInjectorDecorator = (target) => explorePrototype(target, (prototypeClass) => {
        injectorDecorator({
            key: prototypeClass,
            callback: (container, type, context) => {
                context.created = context.created || [];
                var result = context.created.filter(_ => _.key === type).map(_ => _.value)[0];
                if (!result) {
                    if (type && type.$$vuejs && type.$$vuejs.isComponent) {
                    }
                    else if (type && type.$$vuejs && type.$$vuejs.isVue) {
                        result = container.createService(type, context);
                    }
                    else {
                        result = container.createService(type, context);
                        context.created.push({ key: type, value: result });
                    }
                }
                return result;
            }
        })(target);
    });
    var extendClass = (target, init) => {
        var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(function (instance, args) {
            var d = { zyx123values: instance };
            instance.$vuedata = d;
            var instance = target.apply(instance, args) || instance;
            init(d);
            return instance;
        });
        Object.setPrototypeOf(result, target);
        function __() { this.constructor = result; }
        result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
        return result;
    };
    var ComponentDecorator = (options) => (target) => {
        target.$$vuejs = target.$$vuejs || {};
        target.$$vuejs.isComponent = true;
        var result = extendClass(target, (data) => { });
        vueInjectorDecorator(result);
        var config = GetVueConfig(options)(target);
        delete config.el;
        Vue.component(options.name, (resolve) => {
            config.html.then(template => resolve(Object.assign({}, config, {
                template: template,
                data: function () {
                    var instance = container.createService(result, containerContext);
                    config.setVueInstance(instance, Promise.resolve(this));
                    return instance.$vuedata;
                }
            })));
        });
        return result;
    };
    exports.Component = ComponentDecorator;
    var VueDecorator = (options) => (target) => {
        target.$$vuejs = target.$$vuejs || {};
        target.$$vuejs.isVue = true;
        var result = extendClass(target, (data) => {
            config.setVueInstance(data.zyx123values, config.html.then(template => new Vue(Object.assign({}, config, {
                el: config.el,
                data: data,
                template: template
            }))));
        });
        vueInjectorDecorator(result);
        var config = GetVueConfig(options)(target);
        return result;
    };
    exports.View = VueDecorator;
    var container = new Container();
    var containerContext = {};
    var DirectiveDecorator = (options) => target => {
        vueInjectorDecorator(target);
        var instance = container.createService(target, containerContext);
        Vue.directive(name, {
            bind: instance.bind && instance.bind.bind(instance),
            inserted: instance.inserted && instance.inserted.bind(instance),
            update: instance.update && instance.update.bind(instance),
            componentUpdated: instance.componentUpdated && instance.componentUpdated.bind(instance),
            unbind: instance.unbind && instance.unbind.bind(instance)
        });
    };
    exports.Directive = DirectiveDecorator;
    class IServiceProvider {
    }
    exports.IServiceProvider = IServiceProvider;
    let ServiceProvider = class ServiceProvider extends IServiceProvider {
        createService(target) {
            return container.createService(target, containerContext);
        }
        getService(type) {
            containerContext.created = containerContext.created || {};
            return containerContext.created.filter(_ => _.key === type).map(_ => _.value)[0] || this.createService(type);
        }
    };
    ServiceProvider = __decorate([
        serviceDecorator({ key: IServiceProvider })
    ], ServiceProvider);
    function start(target) {
        container.createService(target, containerContext);
    }
    exports.start = start;
});
