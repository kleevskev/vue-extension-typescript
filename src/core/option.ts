import { deepMerge } from './tools';
let options: { target: any, value: any }[] = [];

export function getVueOptions(target: Function) {
    return options.filter(_ => _.target === target.prototype).map(_ => _.value)[0];
}

export function setVueOptions(target: Function, callback: () => any) {
    if(options.filter(_ => _.target === target)[0] == undefined) {
        options.push({ target: target, value: {} });
    }
    options.filter(_ => _.target === target).forEach(option => { 
        var opt = callback();
        option.value = opt && deepMerge(option.value, opt) || option.value; 
    });
}