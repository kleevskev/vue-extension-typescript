(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getAllFuncs(obj) {
        var props = [];
        var tmp = obj;
        do {
            props = props.concat(Object.getOwnPropertyNames(tmp));
        } while (tmp = Object.getPrototypeOf(tmp));
        return props.sort().filter((e, i, arr) => {
            if (e != arr[i + 1] && typeof obj[e] == 'function' && e !== "constructor" && !e.startsWith("__"))
                return true;
        });
    }
    exports.getAllFuncs = getAllFuncs;
    function createElement(html) {
        html = html.trim();
        var isTr = html.match(/^<tr/);
        var isTd = html.match(/^<td/);
        var parser = document.createElement("div");
        if (isTr || isTd) {
            var table = document.createElement("table");
            parser = document.createElement("tbody");
            table.appendChild(parser);
            if (isTd) {
                var parent = parser;
                parser.appendChild(parser = document.createElement("tr"));
            }
        }
        parser.innerHTML = html;
        return parser.firstChild;
    }
    exports.createElement = createElement;
    ;
    function alreadyMap(option, propName) {
        for (var i in option) {
            if (option[i] && propName in option[i])
                return true;
        }
        return false;
    }
    exports.alreadyMap = alreadyMap;
    function deepCopy(object) {
        if (object instanceof Array || (typeof (object)).trim().toLowerCase() === "object") {
            var result = object instanceof Array && [] || {};
            for (var i in object) {
                result[i] = deepCopy(object[i]);
            }
            return result;
        }
        else {
            return object;
        }
    }
    exports.deepCopy = deepCopy;
    function dm(target, source) {
        if (target instanceof Array || (typeof (target)).trim().toLowerCase() === "object") {
            var result = target;
            for (var i in source) {
                if (source[i] !== undefined || source[i] !== null) {
                    if (target instanceof Array) {
                        result.push(deepCopy(source[i]));
                    }
                    else {
                        result[i] = dm(target[i], source[i]);
                    }
                }
            }
            return result;
        }
        else {
            return source || target;
        }
    }
    function deepMerge(target, source) {
        return dm(deepCopy(target), source);
    }
    exports.deepMerge = deepMerge;
    function getComputedFromData(obj) {
        var computed = {};
        Object.getOwnPropertyNames(obj).forEach((key) => {
            computed[key] = {
                get: function () { return this._data.instance_extension_vuejs[key]; },
                set: function (v) { return this._data.instance_extension_vuejs[key] = v; }
            };
        });
        return computed;
    }
    exports.getComputedFromData = getComputedFromData;
});
