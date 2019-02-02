export declare function Directive<T>(options: {
    name: string;
}): <T>(target: new (...arg: any[]) => T) => void;
