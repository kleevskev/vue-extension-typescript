import { Service } from './ioc';
declare var dataDecorator: any;
declare var computedDecorator: any;
declare var watchDecorator: any;
declare var methodDecorator: any;
declare var eventDecorator: any;
declare var propDecorator: any;
declare var routeParamDecorator: any;
declare var refDecorator: any;
declare var ComponentDecorator: (options: {
    name: string;
    html: Promise<string>;
    routes?: any[];
}) => (target: any) => any;
declare var VueDecorator: (options: {
    html: Promise<string>;
    routes?: any[];
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
declare abstract class IRouterService {
    abstract trigger(href: string, replace?: boolean): any;
}
export { computedDecorator as computed, methodDecorator as methods, propDecorator as props, routeParamDecorator as routeParam, refDecorator as ref, eventDecorator as event, DirectiveDecorator as Directive, Service, dataDecorator as data, watchDecorator as watch, IServiceProvider, IRouterService, VueDecorator as View, ComponentDecorator as Component };
export declare function start(target: any, selector: any): void;
export declare var Plugin: (router: any) => {
    install: (v: any, options: any) => void;
};
