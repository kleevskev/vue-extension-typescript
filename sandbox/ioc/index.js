var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    var context = window;
    context.Reflect = context.Reflect || {};
    context.Reflect.metadata = function (k, v) {
        return function (target) {
            target.$$ioc = target.$$ioc || {};
            target.$$ioc.metadata = {};
            target.$$ioc.metadata[k] = v;
        };
    };
    var Container = /** @class */ (function () {
        function Container() {
        }
        Container.prototype.createService = function (target, context) {
            var trgt = target;
            return trgt.$$ioc && trgt.$$ioc.builder && trgt.$$ioc.builder(this, trgt, context || {}) || new trgt();
        };
        return Container;
    }());
    exports.Container = Container;
    var factoryDecorator = function (callback) { return function (target) {
        target.$$ioc = target.$$ioc || {};
        target.$$ioc.builder = callback;
    }; };
    var injectorDecorator = function (options) { return function (target) {
        return factoryDecorator(function (container, key, context) {
            var trgt = target;
            var param = (trgt.$$ioc && trgt.$$ioc.metadata && trgt.$$ioc.metadata["design:paramtypes"] || [])
                .map(function (type) { return options.callback(container, type, context); });
            // .map((type) => container.createService(type, context));
            var instance = trgt ?
                (param.length <= 0 ?
                    new trgt() :
                    new (trgt.bind.apply(trgt, [null].concat(param)))()) : undefined;
            return instance;
        })(options.key);
    }; };
    var serviceDecorator = function (options) { return injectorDecorator({
        key: options.key,
        callback: function (container, type, context) {
            context.created = context.created || [];
            var result = context.created.filter(function (_) { return _.key === type; }).map(function (_) { return _.value; })[0];
            if (!result) {
                result = container.createService(type, context);
                context.created.push({ key: type, value: result });
            }
            return result;
        }
    }); };
    var Abstract = /** @class */ (function () {
        function Abstract() {
        }
        return Abstract;
    }());
    var Test1 = /** @class */ (function (_super) {
        __extends(Test1, _super);
        function Test1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Test1 = __decorate([
            serviceDecorator({ key: Abstract })
        ], Test1);
        return Test1;
    }(Abstract));
    var Test2 = /** @class */ (function () {
        function Test2(t1) {
            this.t1 = t1;
        }
        Test2_1 = Test2;
        Test2 = Test2_1 = __decorate([
            serviceDecorator({ key: Test2_1 }),
            __metadata("design:paramtypes", [Abstract])
        ], Test2);
        return Test2;
        var Test2_1;
    }());
    var Test3 = /** @class */ (function () {
        function Test3(t1, t2) {
            this.t1 = t1;
            this.t2 = t2;
            console.log(t1 === t2.t1);
        }
        Test3_1 = Test3;
        Test3 = Test3_1 = __decorate([
            serviceDecorator({ key: Test3_1 }),
            __metadata("design:paramtypes", [Abstract, Test2])
        ], Test3);
        return Test3;
        var Test3_1;
    }());
    new Container().createService(Test3);
});
