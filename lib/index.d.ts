export { ViewService as View } from 'decorator/view.service';
export { computed } from 'decorator/computed';
export { methods } from 'decorator/methods';
export { Directive } from 'decorator/directive';
export { ServiceDecorator as Service, IProvider as IServiceProvider } from 'core/dependency-injection';
import 'configuration';
import 'directive/view.directive';
export declare function start(target: any, element: any): void;
