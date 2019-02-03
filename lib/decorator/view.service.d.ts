export declare function ViewService(options: {
    html: string | Promise<string>;
}): <T>(target: new (...arg: any[]) => T, metadata?: any) => new (...arg: any[]) => T;
