let options = [];

export function getVueOptions(target: Function) {
    return options.filter(_ => _.target === target.prototype).map(_ => _.value)[0];
}

export function setVueOptions(target: Function, name: string, callback: (obj: any) => any) {
    if(options.filter(_ => _.target === target)[0] == undefined) {
        options.push({ target: target, value: {} });
    }
    options.filter(_ => _.target === target).map(_ => _.value).forEach(option => { 
        option[name] = option[name] || {}
        option[name] = callback(option[name]) || option[name]; 
    });
}