(function() {
var __REQUIRE__ = {};
var __MODE__ = typeof __META__ !== "undefined" && (__META__.MODE === "AMD" && "AMD" || __META__.MODE === "NODE" && "NODE") || undefined;
var __META__ = {}; 
__META__.MODE = __MODE__;
__MODE__ = undefined;
(function (factory, context) {
	if (__META__.MODE === "NODE" || typeof module === "object" && typeof module.exports === "object") {
		__META__.MODE = "NODE";
		module.exports = factory(context);
	} else if (__META__.MODE === "AMD" || typeof define === "function" && define.amd) {
		__META__.MODE = "AMD";
		var moduleRequired = __REQUIRE__ = {};
		var required = [];
		define([], function () { 
			Array.prototype.forEach.call(arguments, function(res, i) {
				moduleRequired[required[i]] = res;
			}); 
			
			return factory(context); 
		});
	} else {
		__META__.MODE = "";
		var m = factory(context);
		window.VueTs = m;
	}

})(function (context) {
	var throw_exception = function (msg) { throw msg; };
	
	__REQUIRE__ = undefined;
	throw_exception = undefined;
	context = undefined;
	var define = (function() {
		var paths = [{ test: /^\/?(node_modules\/*)/, result: "/$1" },{ test: /^\/?(core\/*)/, result: "/lib/$1" }];
		var modules = {};
		var normalize = function (path) {
			var tmp = path.split("/");
			var i = 0;
			var last = -1;
			while (i <tmp.length) {
				if (tmp[i] === "..") {
					tmp[i] = ".";
					last > 0 && (tmp[last] = ".");
					last-=2;
				} else if (tmp[i] === ".") {
					last--;
				}
				last++;
				i++;
			}

			return tmp.filter(_ => _ !== ".").join("/");
		}
		var getUri = function(uri, context) {
			paths.some(path => {
				if (uri.match(path.test)) {
					uri = uri.replace(path.test, path.result);
					return true;
				}
			});
			var href = (uri && !uri.match(/^\//) && context && context.replace(/(\/?)[^\/]*$/, '$1') || '') + uri;
			href = href.replace(/^\/?(.*)$/, '/$1.js');
			href = href.replace(/\\/gi, "/");
			href = normalize(href);
			return href.replace(/^\//, '');
		}

		var define = function (id, dependencies, factory) {
			return modules[id] = factory.apply(null, dependencies.map(function (d) { 
				if (d !== "exports" && d !== "require") {
					return modules[getUri(d, id)]; 
				}
				
				if (d === "exports") {
					return modules[id] = {};
				}
				
				if (d === "require") {
					return function (k) { var uri = getUri(k, id); return modules[uri]; };
				}
			})) || modules[id];
		}
		define.amd = {};
		return define; 
	})();

	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/decorator.js', ["require", "exports"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    function createDecoratorWithDefaultOption(callback) {
	        return (defaultOption) => {
	            var result = (target, key, desc) => {
	                if (target.constructor.prototype !== target) {
	                    return callback.bind(null, target);
	                }
	                else {
	                    return callback(defaultOption(target, key, desc), target, key, desc);
	                }
	            };
	            return result;
	        };
	    }
	    exports.createDecoratorWithDefaultOption = createDecoratorWithDefaultOption;
	    function createDecoratorWithOption(callback) {
	        return (options) => {
	            return callback.bind(null, options);
	        };
	    }
	    exports.createDecoratorWithOption = createDecoratorWithOption;
	    function createDecorator(callback) {
	        return callback;
	    }
	    exports.createDecorator = createDecorator;
	    function decorateStorage(target, key) {
	        var storage;
	        var trgt = target;
	        key = key || "$root$";
	        trgt.$$decorateStorage$$ = trgt.$$decorateStorage$$ || {};
	        storage = (trgt.$$decorateStorage$$[key] = trgt.$$decorateStorage$$[key] || {});
	        return {
	            get: (key) => {
	                var obj = storage[key] = storage[key] || {};
	                return {
	                    set: (key, value) => {
	                        obj[key] = obj[key] || {};
	                        obj[key] = value;
	                    },
	                    get: (key) => obj && obj[key],
	                    getAll: () => obj
	                };
	            }
	        };
	    }
	    exports.decorateStorage = decorateStorage;
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/ioc.js', ["require", "exports", "./decorator"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const decorator_1 = require("./decorator");
	    const StoageMetadataKey = "StoageMetadataKey";
	    const StoageCallbackIOCFactoryKey = "StoageCallbackIOCFactoryKey";
	    const StorageConcreteClassKey = "StorageConcreteClassKey";
	    var context = window;
	    context.Reflect = context.Reflect || {};
	    context.Reflect.metadata = (k, v) => {
	        return function (target, key) {
	            decorator_1.decorateStorage(target, key).get(StoageMetadataKey).set(k, v);
	        };
	    };
	    class Container {
	        createService(target, context, contextCreator) {
	            var trgt = target;
	            var builder = decorator_1.decorateStorage(target).get(StoageCallbackIOCFactoryKey).get("builder");
	            return builder && builder(this, trgt, context || {}, contextCreator || {}) || new trgt();
	        }
	    }
	    exports.Container = Container;
	    var factoryDecorator = decorator_1.createDecoratorWithOption((option, target) => {
	        decorator_1.decorateStorage(target).get(StoageCallbackIOCFactoryKey).set("builder", option);
	    });
	    var injectorDecorator = decorator_1.createDecoratorWithOption((option, target) => {
	        factoryDecorator((container, targetKey, context, contextCreator) => {
	            var param = (decorator_1.decorateStorage(target).get(StoageMetadataKey).get("design:paramtypes") || [])
	                .map((type) => option.callback(container, type, context, contextCreator));
	            var instance = target ?
	                (param.length <= 0 ?
	                    new target() :
	                    new (target.bind.apply(target, [null].concat(param)))()) : undefined;
	            return instance;
	        })(option.key, null, null);
	    });
	    var serviceDecorator = (options) => (target) => {
	        decorator_1.decorateStorage(options.key).get(StorageConcreteClassKey).set("value", target);
	        injectorDecorator({
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
	        })(target, null, null);
	    };
	    exports.Service = serviceDecorator;
	    var getConcreteClass = (target) => {
	        return target && decorator_1.decorateStorage(target).get(StorageConcreteClassKey).get("value");
	    };
	    exports.getConcreteClass = getConcreteClass;
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/mixin.js', ["require", "exports"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    function extendClass(target, before, after) {
	        var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(function (instance, args) {
	            before && before(this);
	            var instance = target.apply(instance, args) || instance;
	            after && after(instance);
	            return instance;
	        });
	        Object.setPrototypeOf(result, target);
	        function __() { this.constructor = result; }
	        result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
	        return result;
	    }
	    exports.extendClass = extendClass;
	});
	
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/vue.extend.js', ["require", "exports", "./ioc", "./mixin", "./decorator"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const ioc_1 = require("./ioc");
	    exports.Service = ioc_1.Service;
	    const mixin_1 = require("./mixin");
	    const decorator_1 = require("./decorator");
	    var Vue;
	    var VueRouter;
	    var StorageVueJsOptionsComputedKey = "StorageVueJsOptionsComputedKey";
	    var StorageVueJsOptionsWatchKey = "StorageVueJsOptionsWatchKey";
	    var StorageVueJsOptionsMethodKey = "StorageVueJsOptionsMethodKey";
	    var StorageVueJsOptionsPropKey = "StorageVueJsOptionsPropKey";
	    var StorageVueJsVueContextGetterSetter = "StorageVueJsVueContextGetterSetter";
	    var StorageVueJsComponent = "StorageVueJsComponent";
	    var StorageVueJsRoutes = "StorageVueJsRoutes";
	    var setDefaultConfig = (target) => {
	        for (var property in target.prototype) {
	            ((target, key) => {
	                if (!key.startsWith("_") && !key.startsWith("$") &&
	                    !decorator_1.decorateStorage(target).get(StorageVueJsOptionsComputedKey).get(key) &&
	                    !decorator_1.decorateStorage(target).get(StorageVueJsOptionsPropKey).get(key)) {
	                    var descriptor = Object.getOwnPropertyDescriptor(target, key);
	                    if (descriptor.get && descriptor.set) {
	                        dataDecorator(target, key, descriptor);
	                    }
	                    else if (descriptor.set) {
	                        propDecorator(target, key, descriptor);
	                    }
	                    else if (descriptor.get) {
	                        computedDecorator(target, key);
	                    }
	                    else if (typeof (descriptor.value) === "function") {
	                        methodDecorator(target, key);
	                    }
	                }
	            })(target.prototype, property);
	        }
	    };
	    var GetVueConfig = (target, html) => {
	        setDefaultConfig(target);
	        return html.then(html => ({
	            computed: decorator_1.decorateStorage(target.prototype).get(StorageVueJsOptionsComputedKey).getAll(),
	            watch: decorator_1.decorateStorage(target.prototype).get(StorageVueJsOptionsWatchKey).getAll(),
	            methods: decorator_1.decorateStorage(target.prototype).get(StorageVueJsOptionsMethodKey).getAll(),
	            props: decorator_1.decorateStorage(target.prototype).get(StorageVueJsOptionsPropKey).getAll(),
	            template: html
	        }));
	    };
	    var extendClass = (target, init) => mixin_1.extendClass(target, (instance) => {
	        decorator_1.decorateStorage(target.prototype).get(StorageVueJsVueContextGetterSetter).set("getter", (instance) => {
	            return instance.$$vueContext$$;
	        });
	    }, init);
	    var explorePrototype = (target, callback) => {
	        var classTarget = Object.getPrototypeOf(target);
	        while (classTarget && classTarget.constructor !== classTarget && classTarget.name) {
	            callback(classTarget);
	            classTarget = Object.getPrototypeOf(classTarget);
	        }
	    };
	    var createConfigForVueRouter = (routes) => routes && routes.map(_ => {
	        var concrete = ioc_1.getConcreteClass(_.component);
	        var component = decorator_1.decorateStorage(concrete).get(StorageVueJsComponent).get("value");
	        var childRoutes = decorator_1.decorateStorage(concrete).get(StorageVueJsRoutes).get("value");
	        _.component = component || _.component;
	        _.children = createConfigForVueRouter(childRoutes || _.children || []);
	        return _;
	    });
	    var dataDecorator = decorator_1.createDecoratorWithDefaultOption((options, target, key) => {
	        decorator_1.decorateStorage(target).get(StorageVueJsOptionsComputedKey).set(options, {
	            get: function () {
	                return this.$data.zyx123values[key];
	            },
	            set: function (value) {
	                this.$data.zyx123values[key] = value;
	            }
	        });
	    })((target, key) => key);
	    exports.data = dataDecorator;
	    var computedDecorator = decorator_1.createDecoratorWithDefaultOption((options, target, key) => {
	        decorator_1.decorateStorage(target).get(StorageVueJsOptionsComputedKey).set(options, function () {
	            return this.$data.zyx123values[key];
	        });
	    })((target, key) => key);
	    exports.computed = computedDecorator;
	    var watchDecorator = decorator_1.createDecoratorWithDefaultOption((options, target, key) => {
	        decorator_1.decorateStorage(target).get(StorageVueJsOptionsWatchKey).set(options, function () {
	            this.$data.zyx123values[key].apply(this.$data.zyx123values, arguments);
	        });
	    })((target, key) => key);
	    exports.watch = watchDecorator;
	    var methodDecorator = decorator_1.createDecoratorWithDefaultOption((options, target, key) => {
	        decorator_1.decorateStorage(target).get(StorageVueJsOptionsMethodKey).set(options, function () {
	            return this.$data.zyx123values[key].apply(this.$data.zyx123values, arguments);
	        });
	    })((target, key) => key);
	    exports.methods = methodDecorator;
	    var eventDecorator = decorator_1.createDecoratorWithDefaultOption((options, target, key, desc) => {
	        var _super = desc.value;
	        desc.value = function () {
	            var result = _super.apply(this, arguments);
	            var getter = decorator_1.decorateStorage(target).get(StorageVueJsVueContextGetterSetter).get("getter");
	            var vueContext = getter && getter(this);
	            vueContext && vueContext.$emit(key, result);
	            return result;
	        };
	    })((target, key) => key);
	    exports.event = eventDecorator;
	    var propDecorator = decorator_1.createDecoratorWithDefaultOption((options, target, key) => {
	        decorator_1.decorateStorage(target).get(StorageVueJsOptionsPropKey).set(options, {});
	        decorator_1.decorateStorage(target).get(StorageVueJsOptionsWatchKey).set(options, {
	            immediate: true,
	            handler() {
	                this.$data.zyx123values[key] = this[options];
	            },
	        });
	    })((target, key) => key);
	    exports.props = propDecorator;
	    var routeParamDecorator = decorator_1.createDecoratorWithDefaultOption((options, target, key) => {
	        decorator_1.decorateStorage(target).get(StorageVueJsOptionsWatchKey).set(`$route.params.${options}`, {
	            immediate: true,
	            handler() {
	                this.$data.zyx123values[key] = this[options];
	            }
	        });
	    })((target, key) => key);
	    exports.routeParam = routeParamDecorator;
	    var refDecorator = decorator_1.createDecoratorWithDefaultOption((options, target, key, desc) => {
	        desc = desc || {};
	        desc.get = () => {
	            var getter = decorator_1.decorateStorage(target).get(StorageVueJsVueContextGetterSetter).get("getter");
	            var vueContext = getter && getter(this);
	            return vueContext && vueContext.$refs[options];
	        };
	        return desc;
	    })((target, key) => key);
	    exports.ref = refDecorator;
	    var vueServiceDecorator = (target) => explorePrototype(target, (prototypeClass) => {
	        ioc_1.Service({ key: prototypeClass })(target);
	    });
	    var ComponentDecorator = (options) => (target) => {
	        var result = extendClass(target);
	        decorator_1.decorateStorage(result).get(StorageVueJsRoutes).set("value", options.routes);
	        vueServiceDecorator(result);
	        decorator_1.decorateStorage(target.prototype).get(StorageVueJsVueContextGetterSetter).set("getter", (instance) => {
	            return instance.$$vueContext$$;
	        });
	        decorator_1.decorateStorage(result).get(StorageVueJsVueContextGetterSetter).set("getter", (instance) => {
	            var getter = decorator_1.decorateStorage(target.prototype).get(StorageVueJsVueContextGetterSetter).get("getter");
	            return getter && getter(instance);
	        });
	        decorator_1.decorateStorage(result).get(StorageVueJsComponent).set("value", Vue.component(`${options.name}`, (resolve) => {
	            GetVueConfig(target, options.html).then(config => {
	                resolve(Object.assign({}, config, {
	                    data: function () {
	                        var instance = container.createService(result, containerContext);
	                        instance.$$vueContext$$ = this;
	                        return {
	                            zyx123values: instance
	                        };
	                    }
	                }));
	            });
	        }));
	        return result;
	    };
	    exports.Component = ComponentDecorator;
	    var VueDecorator = (options) => (target) => {
	        var result = extendClass(target, (data) => {
	            var router = new VueRouter({
	                mode: 'history',
	                routes: createConfigForVueRouter(options.routes)
	            });
	            GetVueConfig(target, options.html).then(config => {
	                data.$$vueContext$$ = new Vue(Object.assign({}, config, {
	                    data: {
	                        zyx123values: data
	                    },
	                    router: router
	                }));
	            });
	        });
	        decorator_1.decorateStorage(target.prototype).get(StorageVueJsVueContextGetterSetter).set("getter", (instance) => {
	            return instance.$$vueContext$$;
	        });
	        decorator_1.decorateStorage(result).get(StorageVueJsVueContextGetterSetter).set("getter", (instance) => {
	            var getter = decorator_1.decorateStorage(target.prototype).get(StorageVueJsVueContextGetterSetter).get("getter");
	            return getter && getter(instance);
	        });
	        decorator_1.decorateStorage(result).get(StorageVueJsRoutes).set("value", options.routes);
	        return result;
	    };
	    exports.View = VueDecorator;
	    var container = new ioc_1.Container();
	    var containerContext = {};
	    var rootView;
	    var DirectiveDecorator = (options) => target => {
	        ioc_1.Service({ key: target })(target);
	        var instance = container.createService(target, containerContext);
	        Vue.directive(options.name, {
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
	    class IRouterService {
	    }
	    exports.IRouterService = IRouterService;
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
	        ioc_1.Service({ key: IServiceProvider })
	    ], ServiceProvider);
	    let RouterService = class RouterService extends IRouterService {
	        constructor() {
	            super();
	        }
	        trigger(href, replace) {
	            if (replace) {
	                rootView.$router.replace(href);
	            }
	            else {
	                rootView.$router.push(href);
	            }
	        }
	    };
	    RouterService = __decorate([
	        ioc_1.Service({ key: IRouterService }),
	        __metadata("design:paramtypes", [])
	    ], RouterService);
	    function start(target, selector) {
	        var startup = container.createService(target, containerContext);
	        var getter = decorator_1.decorateStorage(target).get(StorageVueJsVueContextGetterSetter).get("getter");
	        setTimeout(() => {
	            rootView = getter && getter(startup);
	            rootView.$mount(selector);
	        });
	    }
	    exports.start = start;
	    exports.Plugin = (router) => ({
	        install: (v, options) => {
	            Vue = v;
	            VueRouter = router;
	        }
	    });
	    if (window.Vue && window.VueRouter) {
	        Vue.use(exports.Plugin(VueRouter));
	    }
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/index.js', ["require", "exports", "vue.extend"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    function __export(m) {
	        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    __export(require("vue.extend"));
	});
	

	return define('export', ["lib/index"], function(m) { 
		return m;
	});
}, typeof window !== "undefined" && window || {});
})()
