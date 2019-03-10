export declare type DecoratorBuilder<TOption> = (option: TOption, target: Function, key: string, desc?) => any;
export declare type DefaultOption<TOption> = (target: Function, key: string, desc?) => TOption;
export declare type Decorator = (target: Function, key: string, desc?) => any;
export declare type DecoratorWithOption<TOption> = (options: TOption) => Decorator;
export declare type DecoratorWithDefaultOption<TOption> = any;

export function createDecoratorWithDefaultOption<TOption>(callback: DecoratorBuilder<TOption>): (defaultOption: DefaultOption<TOption>) => DecoratorWithDefaultOption<TOption> {
    return (defaultOption: DefaultOption<TOption>) => {
        var result: any = (target, key, desc?) => {
            if (target.constructor.prototype !== target) {
                return callback.bind(null, target);
            } else {
                return callback(defaultOption(target, key, desc), target, key, desc);
            }
        }

        return result;
    }
}

export function createDecoratorWithOption<TOption>(callback: DecoratorBuilder<TOption>): DecoratorWithOption<TOption> {
    return (options: TOption) => {
        return callback.bind(null, options);
    }
}


export function createDecorator(callback: Decorator): Decorator {
    return callback;
}

export function decorateStorage(target: Function, key?: string) {
    var storage;
    var trgt: any = target;
    key = key || "$root$";
    trgt.$$decorateStorage$$ = trgt.$$decorateStorage$$ || {};
    storage = (trgt.$$decorateStorage$$[key] = trgt.$$decorateStorage$$[key] || {});
    return {
        get: (key: string) => { 
            var obj = storage[key] = storage[key] || {}; 
            return {
                set: <T>(key: string, value: T) => {
                    obj[key] = obj[key] || {}; 
                    obj[key] = value;
                },
                get: <T>(key) => obj && obj[key],
                getAll: () => obj
            };
        }
    };
}