export declare function ComponentService(options: {
    name: string;
    html: string | Promise<string>;
}): <T>(target: new (...arg: any[]) => T, metadata?: any) => new (...arg: any[]) => T;
