declare class Container {
    createService<T>(target: Function & {
        prototype: T;
    }): T;
    createService<T>(target: Function & {
        prototype: T;
    }, context: any): T;
    createService<T>(target: Function & {
        prototype: T;
    }, context: any, contextCreator: any): T;
}
declare var serviceDecorator: <TKey>(options: {
    key: Function & {
        prototype: TKey;
    };
}) => (target: any) => void;
declare var getConcreteClass: (target: Function) => any;
export { serviceDecorator as Service, getConcreteClass, Container };
