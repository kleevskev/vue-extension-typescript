import { Service, Container, getConcreteClass } from './ioc';
import { extendClass as extendClassBase } from './mixin';
import { createDecoratorWithDefaultOption, decorateStorage, Decorator } from './decorator';

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
        ((target: Function, key: string) => {
            if (
                !key.startsWith("_") && !key.startsWith("$") &&
                !decorateStorage(target).get(StorageVueJsOptionsComputedKey).get(key) &&
                !decorateStorage(target).get(StorageVueJsOptionsPropKey).get(key)
            ) {
                var descriptor = Object.getOwnPropertyDescriptor(target, key);
                if (descriptor.get && descriptor.set) {
                    (<Decorator>dataDecorator)(target, key, descriptor);
                } else if (descriptor.set) {
                    (<Decorator>propDecorator)(target, key, descriptor);
                } else if (descriptor.get) {
                    (<Decorator>computedDecorator)(target, key);
                } else if (typeof(descriptor.value) === "function") {
                    (<Decorator>methodDecorator)(target, key);
                }
            }
        })(target.prototype, property);
      }
}

var GetVueConfig = (target: Function, html: Promise<string>) => {
    setDefaultConfig(target);
    return html.then(html => ({
        computed: decorateStorage(target.prototype).get(StorageVueJsOptionsComputedKey).getAll(),
        watch: decorateStorage(target.prototype).get(StorageVueJsOptionsWatchKey).getAll(),
        methods: decorateStorage(target.prototype).get(StorageVueJsOptionsMethodKey).getAll(),
        props: decorateStorage(target.prototype).get(StorageVueJsOptionsPropKey).getAll(),
        template: html
    }));
}

var extendClass = (target: Function, init?: (instance) => void) => extendClassBase(target, (instance) => {
    decorateStorage(target.prototype).get(StorageVueJsVueContextGetterSetter).set("getter", (instance) => {
        return instance.$$vueContext$$;
    });
}, init);

var explorePrototype = (target, callback: (target) => void) => {
    var classTarget = Object.getPrototypeOf(target);
    while (classTarget && classTarget.constructor !== classTarget && classTarget.name) {
        callback(classTarget);
        classTarget = Object.getPrototypeOf(classTarget);
    }
}

var createConfigForVueRouter = (routes: any[]) => routes && routes.map(_ => {
    var concrete = getConcreteClass(_.component);
    var component = decorateStorage(concrete).get(StorageVueJsComponent).get("value");
    var childRoutes = decorateStorage(concrete).get(StorageVueJsRoutes).get("value");
    _.component = component || _.component;
    _.children = createConfigForVueRouter(childRoutes || _.children || []);
    return _;
})

var dataDecorator = createDecoratorWithDefaultOption<string>((options, target, key) => {
    decorateStorage(target).get(StorageVueJsOptionsComputedKey).set(options, {
        get: function () {
            return this.$data.zyx123values[key];
        },
        set: function (value) {
            this.$data.zyx123values[key] = value;
        }
    });
})((target, key) => key);

var computedDecorator = createDecoratorWithDefaultOption<string>((options, target, key) => {
    decorateStorage(target).get(StorageVueJsOptionsComputedKey).set(options, function () {
        return this.$data.zyx123values[key];
    });
})((target, key) => key);

var watchDecorator = createDecoratorWithDefaultOption<string>((options, target, key) => {
    decorateStorage(target).get(StorageVueJsOptionsWatchKey).set(options, function () {
        this.$data.zyx123values[key].apply(this.$data.zyx123values, arguments);
    });
})((target, key) => key);

var methodDecorator = createDecoratorWithDefaultOption<string>((options, target, key) => {
    decorateStorage(target).get(StorageVueJsOptionsMethodKey).set(options, function () {
        return this.$data.zyx123values[key].apply(this.$data.zyx123values, arguments);
    });
})((target, key) => key);

var eventDecorator = createDecoratorWithDefaultOption<string>((options, target, key, desc) => {
    var _super = desc.value;
    desc.value = function () {
        var result = _super.apply(this, arguments);
        var getter = decorateStorage(target).get(StorageVueJsVueContextGetterSetter).get("getter");
        var vueContext = getter && getter(this);
        vueContext && vueContext.$emit(key, result);
        return result;
    }
})((target, key) => key);

var propDecorator = createDecoratorWithDefaultOption<string>((options, target, key) => {
    decorateStorage(target).get(StorageVueJsOptionsPropKey).set(options, {});
    decorateStorage(target).get(StorageVueJsOptionsWatchKey).set(options, {
        immediate: true,
        handler() {
            this.$data.zyx123values[key] = this[options];
        },
    });
})((target, key) => key);

var routeParamDecorator = createDecoratorWithDefaultOption<string>((options, target, key) => {
    decorateStorage(target).get(StorageVueJsOptionsWatchKey).set(`$route.params.${options}`, {
        immediate: true,
        handler() {
            this.$data.zyx123values[key] = this.$route.params[options];
        }
    });
})((target, key) => key);

var refDecorator = createDecoratorWithDefaultOption<string>((options, target, key, desc) => {
    desc = desc || {};
    desc.get = () => {
        var getter = decorateStorage(target).get(StorageVueJsVueContextGetterSetter).get("getter");
        var vueContext = getter && getter(this);
        return vueContext && vueContext.$refs[options];
    }
    return desc;
})((target, key) => key);

var vueServiceDecorator = (target) => explorePrototype(target, (prototypeClass) => {
    Service({ key: prototypeClass })(target);
});

var ComponentDecorator = (options: { name: string; html: Promise<string>, routes?: any[] }) => (target) => {
    var result = extendClass(target);
    decorateStorage(result).get(StorageVueJsRoutes).set("value", options.routes);
    vueServiceDecorator(result);
    decorateStorage(target.prototype).get(StorageVueJsVueContextGetterSetter).set("getter", (instance) => {
        return instance.$$vueContext$$;
    });
    decorateStorage(result).get(StorageVueJsVueContextGetterSetter).set("getter", (instance) => {
        var getter = decorateStorage(target.prototype).get(StorageVueJsVueContextGetterSetter).get("getter");
        return getter && getter(instance);
    });

    decorateStorage(result).get(StorageVueJsComponent).set("value", Vue.component(`${options.name}`, (resolve) => {
        GetVueConfig(target, options.html).then(config => {
            resolve(Object.assign({}, config, {
                data: function () {
                    var instance = container.createService<any>(result, containerContext);
                    instance.$$vueContext$$ = this;
                    
                    return {
                        zyx123values: instance
                    };
                }
            }));
        });
    }));

    return result;
}

var VueDecorator = (options: { html: Promise<string>, routes?: any[] }) => (target) => {
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

    decorateStorage(target.prototype).get(StorageVueJsVueContextGetterSetter).set("getter", (instance) => {
        return instance.$$vueContext$$;
    });
    decorateStorage(result).get(StorageVueJsVueContextGetterSetter).set("getter", (instance) => {
        var getter = decorateStorage(target.prototype).get(StorageVueJsVueContextGetterSetter).get("getter");
        return getter && getter(instance);
    });
    decorateStorage(result).get(StorageVueJsRoutes).set("value", options.routes);
    return result;
}

var container = new Container();
var containerContext: any = {};
var rootView;

var DirectiveDecorator = (options: {
    name: string
}) => target => {
    Service({ key: target })(target);
    var instance: any = container.createService(target, containerContext);
    Vue.directive(options.name, {
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

abstract class IRouterService {
    abstract trigger(href: string, replace?: boolean);
}

@Service({ key: IServiceProvider })
class ServiceProvider extends IServiceProvider {
    createService<T>(target: Function & { prototype: T }): T {
        return container.createService(target, containerContext);
    }

    getService<T>(type: Function & { prototype: T }): T {
        containerContext.created = containerContext.created || {};
        return containerContext.created.filter(_ => _.key === type).map(_ => _.value)[0] || this.createService(type);
    }
}

@Service({ key: IRouterService })
class RouterService extends IRouterService {
    constructor() {
        super();
    }

    trigger(href: string, replace?: boolean) {
        if (replace) {
            rootView.$router.replace(href);
        } else {
            rootView.$router.push(href);
        }
    }
}

export {
    computedDecorator as computed,
    methodDecorator as methods,
    propDecorator as props,
    routeParamDecorator as routeParam,
    refDecorator as ref,
    eventDecorator as event,
    DirectiveDecorator as Directive,
    Service,
    dataDecorator as data,
    watchDecorator as watch,
    IServiceProvider,
    IRouterService,
    VueDecorator as View,
    ComponentDecorator as Component
}

export function start(target, selector) {
    var startup = container.createService<any>(target, containerContext);
    var getter = decorateStorage(target).get(StorageVueJsVueContextGetterSetter).get("getter");
    setTimeout(() => { 
        rootView = getter && getter(startup);
        rootView.$mount(selector);
    });
}

export var Plugin = (router) => ({
    install: (v, options) => {
        Vue = v;
        VueRouter = router
    }
});

if ((<any>window).Vue && (<any>window).VueRouter) {
    Vue.use(Plugin(VueRouter));
}
