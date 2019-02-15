export function getAllFuncs(obj) {
    var props: string[] = [];
    var tmp = obj;

    do {
        props = props.concat(Object.getOwnPropertyNames(tmp));
    } while (tmp = Object.getPrototypeOf(tmp));

    return props.sort().filter((e, i, arr) => { 
       if (e!=arr[i+1] && typeof obj[e] == 'function' && e !== "constructor" && !e.startsWith("__")) return true;
    });
}

export function createElement(html: string): Element {
	html = html.trim();
	var isTr = html.match(/^<tr/);
	var isTd = html.match(/^<td/);
	var parser: any =  document.createElement("div");
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
	return <Element>parser.firstChild;
};

export function alreadyMap(option: any, propName: string) : boolean {
    for(var i in option) {
        if (option[i] && propName in option[i]) return true;
    }

    return false;
}

export function deepCopy<T>(object: T): T {
	if (object instanceof Array || (<string>typeof(object)).trim().toLowerCase() === "object") {
		var result: any = object instanceof Array && [] || {};
		for(var i in object) {
			result[i] = deepCopy(object[i]);
		}
		return result;
	} else {
		return object;
	}
}

function dm<T1, T2>(target, source) {
	if (target instanceof Array || (<string>typeof(target)).trim().toLowerCase() === "object") {
		var result = target;
		for (var i in source) {
			if (source[i] !== undefined || source[i] !== null) {
				if (target instanceof Array) {
					result.push(deepCopy(source[i]));
				} else {
					result[i] = dm(target[i], source[i]);
				}
			}
		}

		return result;
	} else {
		return source || target;
	}
}

export function deepMerge<T1, T2>(target, source) {
	return dm(deepCopy(target), source);
}

export function getComputedFromData(obj) {
	var computed = {};
	Object.getOwnPropertyNames(obj).forEach((key) => {
		computed[key] = {
			get: function () { return this._data.instance_extension_vuejs[key]; },
			set: function (v) { return this._data.instance_extension_vuejs[key] = v; }
		}
	});
	return computed;
}