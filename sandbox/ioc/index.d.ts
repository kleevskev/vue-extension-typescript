export declare class Container {
    createService<T>(target: Function & {
        prototype: T;
    }): T;
    createService<T>(target: Function & {
        prototype: T;
    }, context: any): T;
}
