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