declare let $: any;
declare let getCurrentUri: () => string;

export let Vue = (<any>window).Vue;
export let VueRouter = (<any>window).VueRouter

let load = (currentpath, str) => new Promise<string>((resolve, reject) => {
    str = /^\//gi.test(str) ? str : normalize(`${currentpath}/${str}`);
    $("<div>").load(`/${str.replace(/^\//i, '')}`, (template, status) => {
        if (status == "error") {
            reject();
        } else {
            resolve(template)
        }
    });
});
let normalize = function (path) {
    var tmp = path.split("/");
    var i = 0;
    var last = -1;
    while (i < tmp.length) {
        if (tmp[i] === "..") {
            tmp[i] = ".";
            last > 0 && (tmp[last] = ".");
            last -= 2;
        } else if (tmp[i] === ".") {
            last--;
        }
        last++;
        i++;
    }

    return tmp.filter(_ => _ !== ".").join("/");
}

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
    while (classTarget && classTarget.constructor !== classTarget && classTarget.name) {
        callback(classTarget);
        classTarget = Object.getPrototypeOf(classTarget);
    }
}

class Container {
    createService<T>(target: Function & { prototype: T }): T
    createService<T>(target: Function & { prototype: T }, context): T
    createService<T>(target: Function & { prototype: T }, context?): T {
        var trgt: any = target;
        return trgt.$$ioc && trgt.$$ioc.builder && trgt.$$ioc.builder(this, trgt, context || {}) || new trgt();
    }

    getConcrete(target: Function) {
        return target && (<any>target).$$ioc && (<any>target).$$ioc.concrete;
    }
}

var factoryDecorator = (callback: <T>(container: Container, target: Function & { prototype: T }, context) => T) => (target) => {
    target.$$ioc = target.$$ioc || {};
    target.$$ioc.builder = callback;
}

var injectorDecorator = <TKey>(options: {
    key: { prototype: TKey },
    callback: <T>(container, target: { prototype: TKey }, context) => T
}) => (target) => {
    var ky: any = options.key;
    ky.$$ioc = ky.$$ioc || {};
    ky.$$ioc.concrete = target;
    return factoryDecorator((container, key, context) => {
        var trgt: any = target;
        var param = (trgt.$$ioc && trgt.$$ioc.metadata && trgt.$$ioc.metadata["design:paramtypes"] || [])
            .map((type) => options.callback(container, type, context));

        var instance = trgt ?
            (param.length <= 0 ?
                new trgt() :
                new (trgt.bind.apply(trgt, [null].concat(param)))()
            ) : undefined;

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
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
    targetPrototype.$$vuejsext.computed = targetPrototype.$$vuejsext.computed || {};
    targetPrototype.$$vuejsext.computed[key] = {
        get: function () {
            return this.$data.zyx123values[key];
        },
        set: function (value) {
            this.$data.zyx123values[key] = value;
        }
    }

    decorate(targetPrototype, key);
}

var decorate = (targetPrototype, key) => {
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
    targetPrototype.$$vuejsext.decorate = targetPrototype.$$vuejsext.decorate || {};
    targetPrototype.$$vuejsext.decorate[key] = true;
}

var isDecorate = (targetPrototype, key) => targetPrototype.$$vuejsext && targetPrototype.$$vuejsext.decorate && targetPrototype.$$vuejsext.decorate[key];

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
        return this.$data.zyx123values[key];
    }
}

var watchDecorator = (name: string) => (targetPrototype, key, desc) => {
    decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
    targetPrototype.$$vuejsext.watch = targetPrototype.$$vuejsext.watch || {};
    targetPrototype.$$vuejsext.watch[name] = function () {
        this.$data.zyx123values[key]();
    }
}

var methodDecorator = (targetPrototype, key, desc) => {
    decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
    targetPrototype.$$vuejsext.methods = targetPrototype.$$vuejsext.methods || {};
    targetPrototype.$$vuejsext.methods[key] = function () {
        this.$data.zyx123values[key].apply(this.$data.zyx123values, arguments);
    }
}

var eventDecorator = (targetPrototype, key, desc) => {
    decorate(targetPrototype, key);
    methodDecorator(targetPrototype, key, desc);
    var _super = desc.value;
    desc.value = function () {
        var result = _super.apply(this, arguments);
        this.$vuejs && this.$vuejs.then(vuejs => vuejs.$emit(key, result));
        return result;
    }
}

var propDecorator = (targetPrototype, key, desc?) => {
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
    targetPrototype.$$vuejsext.watch = targetPrototype.$$vuejsext.watch || {};
    targetPrototype.$$vuejsext.watch[key] = function () {
        this.$data.zyx123values[key] = this[key];
    }
    decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {};
    targetPrototype.$$vuejsext.props = targetPrototype.$$vuejsext.props || {};
    targetPrototype.$$vuejsext.props[key] = {};
}

var setDefaultConfig = (target) => {
    var targetPrototype = target.prototype;
    Object.keys(targetPrototype)
        .filter(key => key.indexOf("$") !== 0 && key.indexOf("_") !== 0)
        .forEach(key => {
            if (!isDecorate(targetPrototype, key)) {
                var descriptor = Object.getOwnPropertyDescriptor(targetPrototype, key);
                if (descriptor.get && descriptor.set) {
                    dataDecorator(targetPrototype, key, descriptor);
                } else if (descriptor.set) {
                    propDecorator(targetPrototype, key, descriptor);
                } else if (descriptor.get) {
                    computedDecorator(targetPrototype, key);
                }
            }
        });
}

var GetVueConfig = (options: { el?: string; name?: string; html: Promise<string> }) => (target) => {
    setDefaultConfig(target);
    target.prototype.$$vuejsext = target.prototype.$$vuejsext || {};
    var data = target.prototype.$$vuejsext.data || {};
    var computed = target.prototype.$$vuejsext.computed || {};
    var watch: any = target.prototype.$$vuejsext.watch || {};
    var props = target.prototype.$$vuejsext.props || {};
    var methods = target.prototype.$$vuejsext.methods || {};
    var html = options.html;
    var el = options.el;
    var inits = target.prototype.$$vuejsext.init || [];
    var beforeMounts = target.prototype.$$vuejsext.beforeMount || [];
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
        setVueInstance: (instance, vi: Promise<any>) => instance.$vuejs = vi
    };
}

var vueInjectorDecorator = (target) => explorePrototype(target, (prototypeClass) => {
    injectorDecorator({
        key: prototypeClass,
        callback: (container, type: any, context) => {
            context.created = context.created || [];
            var result = context.created.filter(_ => _.key === type).map(_ => _.value)[0];
            if (!result) {
                if (type && type.$$staticVuejs && type.$$staticVuejs.isComponent) {

                } else if (type && type.$$staticVuejs && type.$$staticVuejs.isVue) {
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

var extendClass = (target, init: (data) => void) => {
    var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(
        function (instance, args) {
            var d: any = { zyx123values: instance };
            instance.$vuedata = d;
            var instance = target.apply(instance, args) || instance;
            init(d);
            return instance;
        });
    Object.setPrototypeOf(result, target);
    function __() { this.constructor = result; }
    result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
    return result;
}

var ComponentDecorator = (options: { name: string; html: Promise<string> }) => (target) => {
    target.$$staticVuejs = target.$$staticVuejs || {};
    target.$$staticVuejs.isComponent = true;
    var result = extendClass(target, (data) => { });
    result.$$staticVuejs = target.$$staticVuejs;
    vueInjectorDecorator(result);

    var config = GetVueConfig(options)(target);
    delete config.el;

    target.$$staticVuejs.Component = Vue.component(options.name, (resolve) => {
        config.html.then(template => resolve(Object.assign({}, config, {
            template: template,
            data: function () {
                var instance: any = container.createService(result, containerContext);
                config.setVueInstance(instance, Promise.resolve(this));
                return instance.$vuedata;
            }
        })));
    });

    return result;
}

var VueDecorator = (options: { el: string, html: Promise<string>, routes: any[] }) => (target) => {
    target.$$staticVuejs = target.$$staticVuejs || {};
    target.$$staticVuejs.isVue = true;
    var result = extendClass(target, (data) => {
        config.setVueInstance(data.zyx123values, config.html.then(template => new Vue(Object.assign({}, config, {
            el: config.el,
            data: data,
            template: template,
            router: new VueRouter({
                mode: 'history',
                routes: options.routes.map(_ => { 
                    var concrete = container.getConcrete(_.component);
                    _.component = concrete && concrete.$$staticVuejs && concrete.$$staticVuejs.Component;
                    return _;
                })
            })
        }))));
    });

    vueInjectorDecorator(result);
    var config = GetVueConfig(options)(target);

    return result;
}

var container = new Container();
var containerContext: any = {};

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

export function View(options: { el?: string; template: string; routes: any[] });
export function View(options: { el?: string; html: string; routes: any[] });
export function View(options: { el?: string; template?: string; html?: string; routes: any[] }) {
    var currentPath = getCurrentUri().split("/").slice(0, -1).join("/");
    var html = options.html && Promise.resolve(options.html) || options.template && load(currentPath, options.template);
    var routes = options.routes;

    return VueDecorator({ el: options.el, html: html, routes: routes });
};

export function Component(options: { name: string; template: string });
export function Component(options: { name: string; html: string });
export function Component(options: { name: string; template?: string; html?: string }) {
    var currentPath = getCurrentUri().split("/").slice(0, -1).join("/");
    var html = options.html && Promise.resolve(options.html) || options.template && load(currentPath, options.template);
    var name = options.name;

    return ComponentDecorator({ name: name, html: html });
};

export function start(target, selector) {
    container.createService<any>(target, containerContext)
        .$vuejs.then(vuejs => vuejs.$mount(selector));
}

@ComponentDecorator({
    name:"info",
    html: Promise.resolve(`
        <div>
            <input v-model="lastName" @input="change"/> <br/>
            <input v-model="firstName" @input="change"/> <br/>
            <span>id({{id}}) : {{fullName}}</span>
        </div>
    `)
})
class Test {
    @propDecorator
    private id: number;
    @dataDecorator
    private lastName: string;
    @dataDecorator
    private firstName: string;
    @computedDecorator
    private get fullName(): string { return `${this.lastName} ${this.firstName}`; }
    @watchDecorator("lastName")
    log() {
        console.log("le nom a changé");
    }

    @eventDecorator
    change() {
        return this.fullName;
    }
}

@ComponentDecorator({
    name:"property",
    html: Promise.resolve(`
        <div>
			Property <br/>
            <input v-model="lastName"/> <br/>
            <input v-model="firstName"/> <br/>
            <span>id({{id}}) : {{fullName}}</span>
        </div>
    `)
})
class Property {
	private _lastName: string;
    private _firstName: string;
	
	@propDecorator
    private set id(value: number) {}
	
	@dataDecorator
	private set lastName(value: string) { this._lastName = value; }
	private get lastName(): string { return this._lastName; }
	@dataDecorator
	private set firstName(value: string) { this._firstName = value; }
	private get firstName(): string { return this._firstName; }
	
	@computedDecorator
    private get fullName(): string { return `${this.lastName} ${this.firstName}`; }
}

@ComponentDecorator({
    name:"defaut",
    html: Promise.resolve(`
        <div>
			Defaut <br/>
            <input v-model="lastName"/> <br/>
            <input v-model="firstName"/> <br/>
            <span>id({{id}}) : {{fullName}}</span>
        </div>
    `)
})
class Defaut {
	private _lastName: string;
    private _firstName: string;
	
    private set id(value: number) {}
	
	private set lastName(value: string) { this._lastName = value; }
	private get lastName(): string { return this._lastName; }
	private set firstName(value: string) { this._firstName = value; }
	private get firstName(): string { return this._firstName; }
	
    private get fullName(): string { return `${this.lastName} ${this.firstName}`; }
}

@VueDecorator({
    el: "#app",
    html: Promise.resolve(`
    <div>
        <info id='1234' @change="log"/>
		<property id='75' />
		<defaut id='5678' />
    </div>
    `)
})
class App {
    @methodDecorator
    log(value) {
        console.log(value);
    }
}

new Container().createService(App);

