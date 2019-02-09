export declare function Component<T>(options: {
    name: string;
    html: string | Promise<string>;
    provider?: (target: new (...arg: any[]) => T) => T;
}): (target: new (...arg: any[]) => T) => new (...arg: any[]) => T;
