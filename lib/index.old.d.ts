declare var serviceDecorator: <TKey>(options: {
    key: {
        prototype: TKey;
    };
}) => (target: any) => void;
declare var dataDecorator: (targetPrototype: any, key: any, desc?: any) => any;
declare var computedDecorator: (targetPrototype: any, key: any) => void;
declare var watchDecorator: (name: string) => (targetPrototype: any, key: any, desc: any) => void;
declare var methodDecorator: (targetPrototype: any, key: any, desc: any) => void;
declare var eventDecorator: (targetPrototype: any, key: any, desc: any) => void;
declare var propDecorator: (targetPrototype: any, key: any, desc?: any) => any;
declare var ComponentDecorator: (options: {
    name: string;
    html: Promise<string>;
}) => (target: any) => any;
declare var VueDecorator: (options: {
    el: string;
    html: Promise<string>;
}) => (target: any) => any;
declare var DirectiveDecorator: (options: {
    name: string;
}) => (target: any) => void;
declare abstract class IServiceProvider {
    abstract createService<T>(key: Function & {
        prototype: T;
    }): T;
    abstract getService<T>(type: Function & {
        prototype: T;
    }): T;
}
export { VueDecorator as View, ComponentDecorator as Component, computedDecorator as computed, methodDecorator as methods, propDecorator as props, eventDecorator as event, DirectiveDecorator as Directive, serviceDecorator as Service, dataDecorator as data, watchDecorator as watch, IServiceProvider };
export declare function start(target: any): void;
