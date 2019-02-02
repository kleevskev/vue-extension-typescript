export declare function Directive<T>(options: {
    name: string;
}): <T_1>(target: new (...arg: any[]) => T_1) => void;
