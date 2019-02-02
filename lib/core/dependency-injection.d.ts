export declare abstract class IProvider {
    abstract createService<T>(key: Function & {
        prototype: T;
    }): T;
    abstract createService<T>(key: Function & {
        prototype: T;
    }, parameters: any[]): T;
    abstract createService<T>(key: Function & {
        prototype: T;
    }, parameters?: any[]): T;
    abstract getService<T>(type: Function & {
        prototype: T;
    }): T;
}
export declare abstract class IConfig {
    abstract addService<TKey, TValue extends TKey>(key: {
        prototype: TKey;
    }, value: (new (...arg) => TValue), options: {
        parameters: any[];
        registerable: boolean;
        initialize: (instance: TKey) => void;
        test?: (serviceClass: any) => boolean;
    }): void;
    abstract getService<TKey, TValue extends TKey>(key: {
        prototype: TKey;
    }): {
        value: (new (...arg) => TValue);
        parameters: any[];
        registerable: boolean;
        initialize: (instance: any) => void;
    };
}
export declare class DependencyInjector {
    private _config;
    private _provider;
    constructor();
    getConfig(): IConfig;
    getProvider(): IProvider;
    getDecorator(): <TKey, TValue extends TKey>(options: {
        key: {
            prototype: TKey;
        };
        registerable?: boolean;
        initialize?: (instance: TKey) => void;
        test?: (serviceClass: any) => boolean;
    }) => (target: new (...arg: any[]) => TValue) => void;
}
export declare let config: IConfig;
export declare let serviceProvider: IProvider;
export declare let ServiceDecorator: <TKey, TValue extends TKey>(options: {
    key: {
        prototype: TKey;
    };
    registerable?: boolean;
    initialize?: (instance: TKey) => void;
    test?: (serviceClass: any) => boolean;
}) => (target: new (...arg: any[]) => TValue) => void;
