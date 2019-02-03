export declare function View(options: {
    html: string | Promise<string>;
}): <T>(target: new (...arg: any[]) => T) => new (...arg: any[]) => T;
