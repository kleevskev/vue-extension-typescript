var context: Window & { Reflect: { metadata: (k: string, v: any[]) => any, decorate: (decorators, target, key, desc) => any } } = window as any;
context.Reflect = context.Reflect || <any>{}; 
context.Reflect.metadata = (k, v) => {
    return function (target) {
        target.$$ioc = target.$$ioc || {};
        target.$$ioc.metadata = {};
        target.$$ioc.metadata[k] = v;
    };
};

export class Container {
    createService<T>(target: Function & { prototype: T }): T 
    createService<T>(target: Function & { prototype: T }, context): T 
    createService<T>(target: Function & { prototype: T }, context?): T {
        var trgt:any = target;
        return trgt.$$ioc && trgt.$$ioc.builder && trgt.$$ioc.builder(this, trgt, context || {}) || new trgt();
    }
}

var factoryDecorator = (callback: <T>(container: Container, target: Function & { prototype: T }, context)=>T) => (target) => {
    target.$$ioc = target.$$ioc || {};
    target.$$ioc.builder = callback;
}

var injectorDecorator = <TKey>(options: { 
    key: { prototype: TKey }, 
    callback: <T>(container, target: { prototype: TKey }, context) => T
}) => (target) => {
    return factoryDecorator((container, key, context) => {
        var trgt: any = target;
        var param = (trgt.$$ioc && trgt.$$ioc.metadata && trgt.$$ioc.metadata["design:paramtypes"] || [])
            .map((type) => options.callback(container, type, context));

	    var instance = trgt ? 
			(param.length <= 0 ? 
				new trgt() : 
				new (trgt.bind.apply(trgt, [null].concat(param)))()
            ): undefined;
            
        return instance;
    })(options.key);
}

var serviceDecorator = <TKey>(options: { key: { prototype: TKey } }) => injectorDecorator({
    key: options.key,
    callback: (container, type, context) => { 
        context.created = context.created || [];
        var result = context.created.filter(_ => _.key === type).map(_ => _.value)[0];
        if (!result) {
            result = container.createService(type, context);
            context.created.push({ key: type, value: result });
        }

        return result;
    }
});

class Abstract {

}

@serviceDecorator({ key: Abstract })
class Test1 extends Abstract {

}

@serviceDecorator({ key: Test2 })
class Test2 {
    constructor(public t1: Abstract) {}
}

@serviceDecorator({ key: Test3 })
class Test3 {
    constructor(private t1: Abstract, private t2: Test2) {
        console.log(t1 === t2.t1);
    }
}

new Container().createService(Test3);