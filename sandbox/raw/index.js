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
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    var dataDecorator = function (targetPrototype, key, desc) {
        var desc = desc || {};
        var getter = desc && desc.get;
        var setter = desc && desc.set;
        desc.get = function () {
            var value = getter ? getter.apply(this, arguments) : this.$vuedata.zyx123values[key];
            if (value !== this.$vuedata.zyx123values[key]) {
                this.$vuedata.zyx123values[key] = value;
            }
            return value;
        };
        desc.set = function () {
            setter && setter.apply(this, arguments);
            this.$vuedata.zyx123values[key] = setter ? this[key] : arguments[0];
        };
        init(function (data) {
            data.zyx123values = data.zyx123values || {};
            data.zyx123values[key] = data.$$targetInstance[key] != undefined ? data.$$targetInstance[key] : null;
        })(targetPrototype);
        beforeMount(function (vueInstance) {
            var descriptor = {};
            descriptor.set = function () {
                vueInstance.$data.$$targetInstance[key] = arguments[0];
            };
            descriptor.get = function () {
                return vueInstance.$data.zyx123values[key];
            };
            Object.defineProperty(vueInstance, key, descriptor);
        })(targetPrototype);
        decorate(targetPrototype, key);
        return desc;
    };
    var decorate = function (targetPrototype, key) {
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.decorate = targetPrototype.$$vuejsext.decorate || {};
        targetPrototype.$$vuejsext.decorate[key] = true;
    };
    var isDecorate = function (targetPrototype, key) { return targetPrototype.$$vuejsext && targetPrototype.$$vuejsext.decorate && targetPrototype.$$vuejsext.decorate[key]; };
    var init = function (callback) { return function (targetPrototype) {
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.init = targetPrototype.$$vuejsext.init || [];
        targetPrototype.$$vuejsext.init.push(callback);
    }; };
    var beforeMount = function (callback) { return function (targetPrototype) {
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.beforeMount = targetPrototype.$$vuejsext.beforeMount || [];
        targetPrototype.$$vuejsext.beforeMount.push(callback);
    }; };
    var computedDecorator = function (targetPrototype, key) {
        decorate(targetPrototype, key);
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.computed = targetPrototype.$$vuejsext.computed || {};
        targetPrototype.$$vuejsext.computed[key] = function () {
            return this.$data.$$targetInstance[key];
        };
    };
    var watchDecorator = function (name) { return function (targetPrototype, key, desc) {
        decorate(targetPrototype, key);
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.watch = targetPrototype.$$vuejsext.watch || {};
        targetPrototype.$$vuejsext.watch["zyx123values." + name] = function () {
            this.$data.$$targetInstance[key]();
        };
    }; };
    var methodDecorator = function (targetPrototype, key, desc) {
        decorate(targetPrototype, key);
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.methods = targetPrototype.$$vuejsext.methods || {};
        targetPrototype.$$vuejsext.methods[key] = function () {
            this.$data.$$targetInstance[key].apply(this.$data.$$targetInstance, arguments);
        };
    };
    var eventDecorator = function (targetPrototype, key, desc) {
        decorate(targetPrototype, key);
        methodDecorator(targetPrototype, key, desc);
        var _super = desc.value;
        desc.value = function () {
            var result = _super.apply(this, arguments);
            this.$vuedata.$vuejs && this.$vuedata.$vuejs.then(function (vuejs) { return vuejs.$emit(key, result); });
            return result;
        };
    };
    var propDecorator = function (targetPrototype, key, desc) {
        var desc = desc || {};
        var setter = desc && desc.set;
        desc.set = function () {
            setter && setter.apply(this, arguments);
            this.$vuedata[key] !== arguments[0] && (this.$vuedata[key] = arguments[0]);
        };
        decorate(targetPrototype, key);
        targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
        targetPrototype.$$vuejsext.props = targetPrototype.$$vuejsext.props || {};
        targetPrototype.$$vuejsext.props[key] = {};
        return desc;
    };
    var setDefaultConfig = function (target) {
        var targetPrototype = target.prototype;
        Object.keys(targetPrototype).forEach(function (key) {
            if (!isDecorate(targetPrototype, key)) {
                var descriptor = Object.getOwnPropertyDescriptor(targetPrototype, key);
                if (descriptor.get && descriptor.set) {
                    Object.defineProperty(targetPrototype, key, dataDecorator(targetPrototype, key, descriptor));
                }
                else if (descriptor.set) {
                    Object.defineProperty(targetPrototype, key, propDecorator(targetPrototype, key, descriptor));
                }
                else if (descriptor.get) {
                    computedDecorator(targetPrototype, key);
                }
            }
        });
    };
    var GetVueConfig = function (options) { return function (target) {
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
        var initValues = function (d) { return inits.forEach(function (fn) { return fn(d); }); };
        var beforeMount = function () {
            var _this = this;
            beforeMounts.forEach(function (fn) { return fn(_this); });
        };
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
            setVueInstance: function (d, vi) { return d.$vuejs = vi; }
        };
    }; };
    var ComponentDecorator = function (options) { return function (target) {
        var config = GetVueConfig(options)(target);
        delete config.el;
        Vue.component(options.name, function (resolve) {
            config.html.then(function (template) { return resolve(Object.assign({}, config, {
                template: template,
                data: function () {
                    var instance = new target();
                    var d = {};
                    d.$$targetInstance = instance;
                    instance.$vuedata = d;
                    config.initValues(d);
                    config.setVueInstance(d, Promise.resolve(this));
                    return d;
                }
            })); });
        });
    }; };
    var VueDecorator = function (options) { return function (target) {
        var config = GetVueConfig(options)(target);
        var result = (new Function('constructor', "return function " + target.name + "() { constructor(this, arguments); };"))(function (instance, args) {
            var d = {};
            d.$$targetInstance = instance;
            instance.$vuedata = d;
            var instance = target.apply(instance, args) || instance;
            config.initValues(d);
            config.setVueInstance(d, config.html.then(function (template) { return new Vue(Object.assign({}, config, {
                el: config.el || createElement(template),
                data: d,
                template: config.el && template || undefined
            })); }));
        });
        Object.setPrototypeOf(result, target);
        function __() { this.constructor = result; }
        result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
        return result;
    }; };
    var Test = /** @class */ (function () {
        function Test() {
        }
        Object.defineProperty(Test.prototype, "fullName", {
            get: function () { return this.lastName + " " + this.firstName; },
            enumerable: true,
            configurable: true
        });
        Test.prototype.log = function () {
            console.log("le nom a changé");
        };
        Test.prototype.change = function () {
            return this.fullName;
        };
        __decorate([
            propDecorator,
            __metadata("design:type", Number)
        ], Test.prototype, "id", void 0);
        __decorate([
            dataDecorator,
            __metadata("design:type", String)
        ], Test.prototype, "lastName", void 0);
        __decorate([
            dataDecorator,
            __metadata("design:type", String)
        ], Test.prototype, "firstName", void 0);
        __decorate([
            computedDecorator,
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], Test.prototype, "fullName", null);
        __decorate([
            watchDecorator("lastName"),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], Test.prototype, "log", null);
        __decorate([
            eventDecorator,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], Test.prototype, "change", null);
        Test = __decorate([
            ComponentDecorator({
                name: "info",
                html: Promise.resolve("\n        <div>\n            <input v-model=\"lastName\" @input=\"change\"/> <br/>\n            <input v-model=\"firstName\" @input=\"change\"/> <br/>\n            <span>id({{id}}) : {{fullName}}</span>\n        </div>\n    ")
            })
        ], Test);
        return Test;
    }());
    var Property = /** @class */ (function () {
        function Property() {
        }
        Object.defineProperty(Property.prototype, "id", {
            set: function (value) { },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "lastName", {
            get: function () { return this._lastName; },
            set: function (value) { this._lastName = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "firstName", {
            get: function () { return this._firstName; },
            set: function (value) { this._firstName = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "fullName", {
            get: function () { return this.lastName + " " + this.firstName; },
            enumerable: true,
            configurable: true
        });
        __decorate([
            propDecorator,
            __metadata("design:type", Number),
            __metadata("design:paramtypes", [Number])
        ], Property.prototype, "id", null);
        __decorate([
            dataDecorator,
            __metadata("design:type", String),
            __metadata("design:paramtypes", [String])
        ], Property.prototype, "lastName", null);
        __decorate([
            dataDecorator,
            __metadata("design:type", String),
            __metadata("design:paramtypes", [String])
        ], Property.prototype, "firstName", null);
        __decorate([
            computedDecorator,
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], Property.prototype, "fullName", null);
        Property = __decorate([
            ComponentDecorator({
                name: "property",
                html: Promise.resolve("\n        <div>\n\t\t\tProperty <br/>\n            <input v-model=\"lastName\"/> <br/>\n            <input v-model=\"firstName\"/> <br/>\n            <span>id({{id}}) : {{fullName}}</span>\n        </div>\n    ")
            })
        ], Property);
        return Property;
    }());
    var Defaut = /** @class */ (function () {
        function Defaut() {
        }
        Object.defineProperty(Defaut.prototype, "id", {
            set: function (value) { },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Defaut.prototype, "lastName", {
            get: function () { return this._lastName; },
            set: function (value) { this._lastName = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Defaut.prototype, "firstName", {
            get: function () { return this._firstName; },
            set: function (value) { this._firstName = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Defaut.prototype, "fullName", {
            get: function () { return this.lastName + " " + this.firstName; },
            enumerable: true,
            configurable: true
        });
        Defaut = __decorate([
            ComponentDecorator({
                name: "defaut",
                html: Promise.resolve("\n        <div>\n\t\t\tDefaut <br/>\n            <input v-model=\"lastName\"/> <br/>\n            <input v-model=\"firstName\"/> <br/>\n            <span>id({{id}}) : {{fullName}}</span>\n        </div>\n    ")
            })
        ], Defaut);
        return Defaut;
    }());
    var App = /** @class */ (function () {
        function App() {
        }
        App.prototype.log = function (value) {
            console.log(value);
        };
        __decorate([
            methodDecorator,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], App.prototype, "log", null);
        App = __decorate([
            VueDecorator({
                el: "#app",
                html: Promise.resolve("\n    <div>\n        <info id='1234' @change=\"log\"/>\n\t\t<property id='75' />\n\t\t<defaut id='5678' />\n    </div>\n    ")
            })
        ], App);
        return App;
    }());
    new App();
});
