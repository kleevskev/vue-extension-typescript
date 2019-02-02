import { IRegister, config as configViewRegister } from 'core/view';
import { IFactory, config as configDirectiveFactory } from 'core/directive';
import { ServiceDecorator, serviceProvider } from 'core/dependency-injection';

class Register implements IRegister {
    add<TInstance, TClass extends new (...arg) => TInstance>(target: TClass, initialize: (instance: TInstance)=>void) {
        var classTarget = target;
        while(classTarget && classTarget.constructor !== classTarget) {
            ServiceDecorator({
                key: classTarget,
                registerable: false,
                initialize: initialize
            })(target);
            classTarget = Object.getPrototypeOf(classTarget);
        }
    }
}

class Factory implements IFactory {
    create<TInstance, TClass extends new (...arg) => TInstance>(target: TClass) : TInstance {
        return serviceProvider.createService(target);
    }
}

configViewRegister({
    register: new Register()
});

configDirectiveFactory({
    factory: new Factory()
});