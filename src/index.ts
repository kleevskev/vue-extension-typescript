import { serviceProvider } from 'core/dependency-injection';
export { ViewService as View } from 'decorator/view.service';
export { ComponentService as Component } from 'decorator/component.service';
export { computed } from 'decorator/computed';
export { methods } from 'decorator/methods';
export { Directive } from 'decorator/directive';
export { ServiceDecorator as Service, IProvider as IServiceProvider } from 'core/dependency-injection';

import 'directive/view.directive';

export function start(target, element) {
    (<any>serviceProvider.createService(target)).$vuejs.then(_ => element.appendChild(_.$el));
}
