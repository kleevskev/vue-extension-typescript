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
	        define('lib/core/dependency-injection.js', ["require", "exports"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    var context = window;
	    context.Reflect = context.Reflect || {};
	    context.Reflect.metadata = (k, v) => {
	        return function () {
	            let metadata = arguments[arguments.length - 1];
	            metadata[k] = v;
	        };
	    };
	    context.Reflect.decorate = (decorators, target, key, desc) => {
	        var r = key === undefined ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, metadata = {}, d;
	        for (var i = decorators.length - 1; i >= 0; i--) {
	            if (d = decorators[i]) {
	                r = (!key ? d(r, metadata) : !desc ? d(target, key, r, metadata) : d(target, key, metadata)) || r;
	            }
	        }
	        return r;
	    };
	    class IProvider {
	    }
	    exports.IProvider = IProvider;
	    class IConfig {
	    }
	    exports.IConfig = IConfig;
	    class Provider extends IProvider {
	        constructor(_config) {
	            super();
	            this._config = _config;
	            this._register = [];
	        }
	        create(data) {
	            var param = [];
	            data && data.parameters && data.parameters.forEach((key) => {
	                param.push(this.getService(key));
	            });
	            return data.value ?
	                (param.length <= 0 ?
	                    new data.value() :
	                    new (data.value.bind.apply(data.value, [null].concat(param)))()) : undefined;
	        }
	        createService(key, parameters) {
	            let instance;
	            let service = this._config.getService(key);
	            service = service || { value: key, parameters: [] };
	            parameters && (service.parameters = parameters);
	            instance = this.create(service);
	            service && service.initialize && service.initialize(instance);
	            return instance;
	        }
	        getService(key) {
	            if (key == IProvider) {
	                return this;
	            }
	            var result = this._register.filter((item) => item.key === key).map((item) => item.value)[0];
	            var registerable = !result && this._config.getService(key).registerable;
	            result = result || this.createService(key);
	            registerable && this._register.push({ key: key, value: result });
	            return result;
	        }
	    }
	    class Config extends IConfig {
	        constructor() {
	            super();
	            this._register = [];
	        }
	        addService(key, value, options) {
	            this._register.unshift({
	                key: key,
	                value: value,
	                parameters: options.parameters,
	                registerable: options.registerable,
	                initialize: options.initialize,
	                test: options.test
	            });
	        }
	        getService(key) {
	            return this._register
	                .filter((item) => item.key === key)
	                .filter(item => !item.test || item.test(item.value))
	                .map((item) => {
	                return {
	                    value: item.value,
	                    parameters: item.parameters,
	                    registerable: item.registerable,
	                    initialize: item.initialize
	                };
	            })[0];
	        }
	    }
	    class DependencyInjector {
	        constructor() {
	            this._config = new Config();
	            this._provider = new Provider(this._config);
	        }
	        getConfig() { return this._config; }
	        getProvider() { return this._provider; }
	        getDecorator() {
	            return (options) => {
	                var res = (target, metadata) => {
	                    this._config.addService(options.key, target, {
	                        parameters: metadata && metadata["design:paramtypes"] || [],
	                        registerable: options.cachable || options.cachable === undefined,
	                        initialize: options.initialize
	                    });
	                };
	                return res;
	            };
	        }
	    }
	    exports.DependencyInjector = DependencyInjector;
	    var injector = new DependencyInjector();
	    exports.config = injector.getConfig();
	    exports.serviceProvider = injector.getProvider();
	    exports.ServiceDecorator = injector.getDecorator();
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/core/tools.js', ["require", "exports"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    function getAllFuncs(obj) {
	        var props = [];
	        var tmp = obj;
	        do {
	            props = props.concat(Object.getOwnPropertyNames(tmp));
	        } while (tmp = Object.getPrototypeOf(tmp));
	        return props.sort().filter((e, i, arr) => {
	            if (e != arr[i + 1] && typeof obj[e] == 'function' && e !== "constructor" && !e.startsWith("__"))
	                return true;
	        });
	    }
	    exports.getAllFuncs = getAllFuncs;
	    function createElement(html) {
	        html = html.trim();
	        var isTr = html.match(/^<tr/);
	        var isTd = html.match(/^<td/);
	        var parser = document.createElement("div");
	        if (isTr || isTd) {
	            var table = document.createElement("table");
	            parser = document.createElement("tbody");
	            table.appendChild(parser);
	            if (isTd) {
	                var parent = parser;
	                parser.appendChild(parser = document.createElement("tr"));
	            }
	        }
	        parser.innerHTML = html;
	        return parser.firstChild;
	    }
	    exports.createElement = createElement;
	    ;
	    function alreadyMap(option, propName) {
	        for (var i in option) {
	            if (option[i] && propName in option[i])
	                return true;
	        }
	        return false;
	    }
	    exports.alreadyMap = alreadyMap;
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/core/view.js', ["require", "exports", "./tools"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const tools_1 = require("./tools");
	    exports.View = (htmlPromise, target, options) => {
	        options = options || {};
	        options.methods = options.methods || {};
	        var html = htmlPromise;
	        var funcs = tools_1.getAllFuncs(target.prototype);
	        funcs.filter(name => !tools_1.alreadyMap(options, name)).forEach(name => {
	            options.methods[name] = function () {
	                return this.$data[name].apply(this.$data, arguments);
	            };
	        });
	        var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(function (instance, args) {
	            var instance = target.apply(instance, args) || instance;
	            instance.$vuejs = html.then(template => new Vue(Object.assign({}, options, {
	                el: tools_1.createElement(template),
	                data: instance
	            })));
	        });
	        Object.setPrototypeOf(result, target);
	        function __() { this.constructor = result; }
	        result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
	        return result;
	    };
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/core/option.js', ["require", "exports"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    let options = [];
	    function getVueOptions(target) {
	        return options.filter(_ => _.target === target.prototype).map(_ => _.value)[0];
	    }
	    exports.getVueOptions = getVueOptions;
	    function setVueOptions(target, name, callback) {
	        if (options.filter(_ => _.target === target)[0] == undefined) {
	            options.push({ target: target, value: {} });
	        }
	        options.filter(_ => _.target === target).map(_ => _.value).forEach(option => {
	            option[name] = option[name] || {};
	            option[name] = callback(option[name]) || option[name];
	        });
	    }
	    exports.setVueOptions = setVueOptions;
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/decorator/view.js', ["require", "exports", "core/view", "core/option"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const view_1 = require("core/view");
	    const option_1 = require("core/option");
	    function View(options) {
	        var html = options.html && (options.html.then && options.html || Promise.resolve(options.html));
	        return (target) => view_1.View(html, target, option_1.getVueOptions(target));
	    }
	    exports.View = View;
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/decorator/view.service.js', ["require", "exports", "./view", "core/dependency-injection"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const view_1 = require("./view");
	    const dependency_injection_1 = require("core/dependency-injection");
	    function ViewService(options) {
	        return (target, metadata) => {
	            target = view_1.View(options)(target) || target;
	            var classTarget = target;
	            while (classTarget && classTarget.constructor !== classTarget) {
	                dependency_injection_1.ServiceDecorator({
	                    key: classTarget,
	                    cachable: false
	                })(target, metadata);
	                classTarget = Object.getPrototypeOf(classTarget);
	            }
	            return target;
	        };
	    }
	    exports.ViewService = ViewService;
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/core/component.js', ["require", "exports", "./tools"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const tools_1 = require("./tools");
	    exports.Component = (name, htmlPromise, target, options) => {
	        options = options || {};
	        options.methods = options.methods || {};
	        var html = htmlPromise;
	        var funcs = tools_1.getAllFuncs(target.prototype);
	        funcs.filter(name => !tools_1.alreadyMap(options, name)).forEach(name => {
	            options.methods[name] = function () {
	                return this.$data[name].apply(this.$data, arguments);
	            };
	        });
	        Vue.component(`vc-${name}`, (resolve, reject) => html
	            .then(template => resolve(Object.assign({}, options, { template: template })))
	            .catch(_ => reject(_)));
	        return target;
	    };
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/decorator/component.js', ["require", "exports", "core/component", "core/option"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const component_1 = require("core/component");
	    const option_1 = require("core/option");
	    function Component(options) {
	        var html = options.html && (options.html.then && options.html || Promise.resolve(options.html));
	        var provider = options.provider;
	        return (target) => target = component_1.Component(options.name, html, target, Object.assign({}, option_1.getVueOptions(target), {
	            data: () => provider && provider(target) || new target()
	        })) || target;
	    }
	    exports.Component = Component;
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/decorator/component.service.js', ["require", "exports", "./component", "core/dependency-injection"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const component_1 = require("./component");
	    const dependency_injection_1 = require("core/dependency-injection");
	    function ComponentService(options) {
	        return (target, metadata) => {
	            target = component_1.Component(Object.assign({}, options, {
	                provider: (t) => dependency_injection_1.serviceProvider.createService(t)
	            }))(target) || target;
	            var classTarget = target;
	            while (classTarget && classTarget.constructor !== classTarget) {
	                dependency_injection_1.ServiceDecorator({
	                    key: classTarget,
	                    cachable: false
	                })(target, metadata);
	                classTarget = Object.getPrototypeOf(classTarget);
	            }
	            return target;
	        };
	    }
	    exports.ComponentService = ComponentService;
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/decorator/computed.js', ["require", "exports", "core/option"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const option_1 = require("core/option");
	    exports.computed = (target, propertyKey) => {
	        return option_1.setVueOptions(target, "computed", (computed) => {
	            computed[propertyKey] = function () {
	                return this.$data[propertyKey].apply(this.$data, arguments);
	            };
	        });
	    };
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/decorator/methods.js', ["require", "exports", "core/option"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const option_1 = require("core/option");
	    exports.methods = (target, propertyKey) => {
	        option_1.setVueOptions(target, "methods", (method) => {
	            method[propertyKey] = function () {
	                return this.$data[propertyKey].apply(this.$data, arguments);
	            };
	        });
	    };
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/core/directive.js', ["require", "exports"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.Directive = (name, instance) => {
	        Vue.directive(name, {
	            bind: instance.bind && instance.bind.bind(instance),
	            inserted: instance.inserted && instance.inserted.bind(instance),
	            update: instance.update && instance.update.bind(instance),
	            componentUpdated: instance.componentUpdated && instance.componentUpdated.bind(instance),
	            unbind: instance.unbind && instance.unbind.bind(instance)
	        });
	    };
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/decorator/directive.js', ["require", "exports", "core/directive", "core/dependency-injection"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const directive_1 = require("core/directive");
	    const dependency_injection_1 = require("core/dependency-injection");
	    function Directive(options) {
	        var name = options.name;
	        return (target, metadata) => {
	            var classTarget = target;
	            while (classTarget && classTarget.constructor !== classTarget) {
	                dependency_injection_1.ServiceDecorator({
	                    key: classTarget,
	                    cachable: false
	                })(target, metadata);
	                classTarget = Object.getPrototypeOf(classTarget);
	            }
	            directive_1.Directive(name, dependency_injection_1.serviceProvider.getService(target));
	        };
	    }
	    exports.Directive = Directive;
	});
	
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
	        define('lib/directive/view.directive.js', ["require", "exports", "../decorator/directive"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const directive_1 = require("../decorator/directive");
	    let ViewDirective = class ViewDirective {
	        bind(el, binding, vnode) {
	            this.update(el, binding, vnode);
	        }
	        update(el, binding, vnode) {
	            if (binding.value && binding.value.$vuejs && binding.value.$vuejs.then) {
	                binding.value.$vuejs.then(_ => {
	                    while (el.firstChild) {
	                        el.removeChild(el.firstChild);
	                    }
	                    el.appendChild(_.$el);
	                });
	            }
	            else {
	                while (el.firstChild) {
	                    el.removeChild(el.firstChild);
	                }
	            }
	        }
	    };
	    ViewDirective = __decorate([
	        directive_1.Directive({ name: "view" })
	    ], ViewDirective);
	});
	
	(function (factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        var v = factory(require, exports);
	        if (v !== undefined) module.exports = v;
	    }
	    else if (typeof define === "function" && define.amd) {
	        define('lib/index.js', ["require", "exports", "core/dependency-injection", "decorator/view.service", "decorator/component.service", "decorator/computed", "decorator/methods", "decorator/directive", "core/dependency-injection", "directive/view.directive"], factory);
	    }
	})(function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    const dependency_injection_1 = require("core/dependency-injection");
	    var view_service_1 = require("decorator/view.service");
	    exports.View = view_service_1.ViewService;
	    var component_service_1 = require("decorator/component.service");
	    exports.Component = component_service_1.ComponentService;
	    var computed_1 = require("decorator/computed");
	    exports.computed = computed_1.computed;
	    var methods_1 = require("decorator/methods");
	    exports.methods = methods_1.methods;
	    var directive_1 = require("decorator/directive");
	    exports.Directive = directive_1.Directive;
	    var dependency_injection_2 = require("core/dependency-injection");
	    exports.Service = dependency_injection_2.ServiceDecorator;
	    exports.IServiceProvider = dependency_injection_2.IProvider;
	    require("directive/view.directive");
	    function start(target, element) {
	        dependency_injection_1.serviceProvider.createService(target).$vuejs.then(_ => element.appendChild(_.$el));
	    }
	    exports.start = start;
	});
	

	return define('export', ["lib/index"], function(m) { 
		return m;
	});
}, typeof window !== "undefined" && window || {});
})()
