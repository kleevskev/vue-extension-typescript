export declare function View<T>(options: {
    html: string | Promise<string>;
}): <T>(target: new (...arg: any[]) => T) => void;
