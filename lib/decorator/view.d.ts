export declare function View<T>(options: {
    html: string | Promise<string>;
}): <T_1>(target: new (...arg: any[]) => T_1) => void;
