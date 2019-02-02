export interface IRegister {
    add<TInstance, TClass extends new (...arg) => TInstance>(target: TClass, initialize: (instance: TInstance) => void): void;
}
export declare let View: <T>(htmlPromise: Promise<string>, target: new (...arg: any[]) => T, options: any) => void;
export declare function config(options: {
    register: IRegister;
}): void;
