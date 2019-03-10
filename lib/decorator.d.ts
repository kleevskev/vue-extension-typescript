export declare type DecoratorBuilder<TOption> = (option: TOption, target: Function, key: string, desc?: any) => any;
export declare type DefaultOption<TOption> = (target: Function, key: string, desc?: any) => TOption;
export declare type Decorator = (target: Function, key: string, desc?: any) => any;
export declare type DecoratorWithOption<TOption> = (options: TOption) => Decorator;
export declare type DecoratorWithDefaultOption<TOption> = any;
export declare function createDecoratorWithDefaultOption<TOption>(callback: DecoratorBuilder<TOption>): (defaultOption: DefaultOption<TOption>) => DecoratorWithDefaultOption<TOption>;
export declare function createDecoratorWithOption<TOption>(callback: DecoratorBuilder<TOption>): DecoratorWithOption<TOption>;
export declare function createDecorator(callback: Decorator): Decorator;
export declare function decorateStorage(target: Function, key?: string): {
    get: (key: string) => {
        set: <T>(key: string, value: T) => void;
        get: <T>(key: any) => any;
        getAll: () => any;
    };
};
