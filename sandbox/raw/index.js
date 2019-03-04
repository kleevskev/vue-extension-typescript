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
            return getter ? getter.apply(this, arguments) : this.$vuedata.zyx123values[key];
        };
        desc.set = function () {
            setter && setter.apply(this, arguments);
            this.$vuedata.zyx123values[key] = setter ? this[key] : arguments[0];
            // this.$vuedata[key] !== arguments[0] && (this.$vuedata[key] = arguments[0]);
        };
        targetPrototype.__vuejsext = targetPrototype.__vuejsext || {};
        targetPrototype.__vuejsext.data = targetPrototype.__vuejsext.data || {};
        targetPrototype.__vuejsext.data[key] = {
            beforeCreate: function (data) {
                data.zyx123values = data.zyx123values || {};
                data.zyx123values[key] = data._instance_[key] != undefined ? data._instance_[key] : null;
            },
            beforeMount: function (vueInstance) {
                var descriptor = {};
                descriptor.set = function () {
                    vueInstance.$data._instance_[key] = arguments[0];
                };
                descriptor.get = function () {
                    return vueInstance.$data.zyx123values[key];
                };
                Object.defineProperty(vueInstance, key, descriptor);
            }
        };
        return desc;
    };
    var computedDecorator = function (targetPrototype, key) {
        targetPrototype.__vuejsext = targetPrototype.__vuejsext || {};
        targetPrototype.__vuejsext.computed = targetPrototype.__vuejsext.computed || {};
        targetPrototype.__vuejsext.computed[key] = function () {
            return this.$data._instance_[key];
        };
    };
    var watchDecorator = function (name) { return function (targetPrototype, key) {
        targetPrototype.__vuejsext = targetPrototype.__vuejsext || {};
        targetPrototype.__vuejsext.watch = targetPrototype.__vuejsext.watch || {};
        targetPrototype.__vuejsext.watch[name] = function () {
            this.$data._instance_[key]();
        };
    }; };
    var methodDecorator = function (targetPrototype, key) {
        targetPrototype.__vuejsext = targetPrototype.__vuejsext || {};
        targetPrototype.__vuejsext.methods = targetPrototype.__vuejsext.methods || {};
        targetPrototype.__vuejsext.methods[key] = function () {
            this.$data._instance_[key].apply(this.$data._instance_, arguments);
        };
    };
    var eventDecorator = function (targetPrototype, key, desc) {
        methodDecorator(targetPrototype, key);
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
        targetPrototype.__vuejsext = targetPrototype.__vuejsext || {};
        targetPrototype.__vuejsext.props = targetPrototype.__vuejsext.props || {};
        targetPrototype.__vuejsext.props[key] = {};
    };
    var GetVueConfig = function (options) { return function (target) {
        target.prototype.__vuejsext = target.prototype.__vuejsext || {};
        var data = target.prototype.__vuejsext.data || {};
        var computed = target.prototype.__vuejsext.computed || {};
        var watch = target.prototype.__vuejsext.watch || {};
        var props = target.prototype.__vuejsext.props || {};
        var methods = target.prototype.__vuejsext.methods || {};
        var html = options.html;
        var el = options.el;
        var initValues = function (d) {
            Object.keys(data).forEach(function (key) { return data[key].beforeCreate(d); });
        };
        var beforeMount = function () {
            var _this = this;
            Object.keys(data).forEach(function (key) { return data[key].beforeMount(_this); });
        };
        // // Object.keys(data).forEach((key) => {
        // //     var _super = watch[key];
        // //     watch[key] = function () {
        // //         _super && _super.apply(this, arguments);
        // //         this.$data._instance_[key] = this[key];
        // //     }
        // // });
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
            // mapper: (instance) => Object.keys(data).forEach((key) => data[key](instance)),
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
                    d._instance_ = instance;
                    instance.$vuedata = d;
                    config.initValues(d);
                    // config.mapper(instance);
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
            d._instance_ = instance;
            instance.$vuedata = d;
            var instance = target.apply(instance, args) || instance;
            config.initValues(d);
            // config.mapper(instance);
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
                html: Promise.resolve("\n    <div>\n        <info id='1234' @change=\"log\"/>\n    </div>\n    ")
            })
        ], App);
        return App;
    }());
    new App();
});
