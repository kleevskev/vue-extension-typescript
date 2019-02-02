export interface IFactory {
    create<TInstance, TClass extends new (...arg: any[]) => TInstance>(target: TClass): TInstance;
}
export declare let Directive: <T>(name: string, target: new (...arg: any[]) => T) => void;
export declare function config(options: {
    factory: IFactory;
}): void;
