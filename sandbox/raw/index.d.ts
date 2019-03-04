declare let Vue: any;
declare var context: Window & {
    Reflect: {
        metadata: (k: string, v: any[]) => any;
        decorate: (decorators, target, key, desc) => any;
    };
};
declare var explorePrototype: (target: any, callback: (target: any) => void) => void;
declare class Container {
    createService<T>(target: Function & {
        prototype: T;
    }): T;
    createService<T>(target: Function & {
        prototype: T;
    }, context: any): T;
}
declare var factoryDecorator: (callback: <T>(container: Container, target: Function & {
    prototype: T;
}, context: any) => T) => (target: any) => void;
declare var injectorDecorator: <TKey>(options: {
    key: {
        prototype: TKey;
    };
    callback: <T>(container: any, target: {
        prototype: TKey;
    }, context: any) => T;
}) => (target: any) => void;
declare var serviceDecorator: <TKey>(options: {
    key: {
        prototype: TKey;
    };
}) => (target: any) => void;
declare function createElement(html: string): Element;
declare var dataDecorator: (targetPrototype: any, key: any, desc?: any) => any;
declare var decorate: (targetPrototype: any, key: any) => void;
declare var isDecorate: (targetPrototype: any, key: any) => any;
declare var init: (callback: (data: any) => void) => (targetPrototype: any) => void;
declare var beforeMount: (callback: (vueInstance: any) => void) => (targetPrototype: any) => void;
declare var computedDecorator: (targetPrototype: any, key: any) => void;
declare var watchDecorator: (name: string) => (targetPrototype: any, key: any, desc: any) => void;
declare var methodDecorator: (targetPrototype: any, key: any, desc: any) => void;
declare var eventDecorator: (targetPrototype: any, key: any, desc: any) => void;
declare var propDecorator: (targetPrototype: any, key: any, desc?: any) => any;
declare var setDefaultConfig: (target: any) => void;
declare var GetVueConfig: (options: {
    el?: string;
    name?: string;
    html: Promise<string>;
}) => (target: any) => {
    data: any;
    computed: any;
    watch: any;
    props: any;
    methods: any;
    html: Promise<string>;
    el: string;
    initValues: (d: any) => any;
    beforeMount: () => void;
    setVueInstance: (d: any, vi: Promise<any>) => Promise<any>;
};
declare var vueInjectorDecorator: (target: any) => void;
declare var ComponentDecorator: (options: {
    name: string;
    html: Promise<string>;
}) => (target: any) => void;
declare var VueDecorator: (options: {
    el: string;
    html: Promise<string>;
}) => (target: any) => any;
declare class Test {
    private id;
    private lastName;
    private firstName;
    private readonly fullName;
    log(): void;
    change(): string;
}
declare class Property {
    private _lastName;
    private _firstName;
    private id;
    private lastName;
    private firstName;
    private readonly fullName;
}
declare class Defaut {
    private _lastName;
    private _firstName;
    private id;
    private lastName;
    private firstName;
    private readonly fullName;
}
declare class App {
    log(value: any): void;
}
