import { serviceProvider } from 'core/dependency-injection';
export { View } from 'decorator/view';
export { computed } from 'decorator/computed';
export { methods } from 'decorator/methods';
export { Directive } from 'decorator/directive';
export { ServiceDecorator as Service } from 'core/dependency-injection';

import 'configuration';
import 'directive/view.directive';

export function start(target, element) {
    (<any>serviceProvider.createService(target)).$vuejs.then(_ => element.appendChild(_.$el));
}
