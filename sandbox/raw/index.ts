declare let Vue: any;

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

var dataDecorator = (targetPrototype, key, desc?) => {
    var desc = desc || {};
    var getter = desc && desc.get;
    var setter = desc && desc.set;
    desc.get = function () {
		var value = getter ? getter.apply(this, arguments) : this.$vuedata.zyx123values[key];
		if (value !== this.$vuedata.zyx123values[key]) {
			this.$vuedata.zyx123values[key] = value;
		}
		
        return value;
    }
    desc.set = function () {
        setter && setter.apply(this, arguments);
        this.$vuedata.zyx123values[key] = setter ? this[key] : arguments[0];
    }
	
	init(data => {
		data.zyx123values = data.zyx123values || {};
        data.zyx123values[key] = data.$$targetInstance[key] != undefined ? data.$$targetInstance[key] : null; 
	})(targetPrototype);
	
	beforeMount(vueInstance => { 
		var descriptor: any = {};
		descriptor.set = function () { 
			vueInstance.$data.$$targetInstance[key] = arguments[0];
		}
		descriptor.get = function () { 
			return vueInstance.$data.zyx123values[key];
		}
		Object.defineProperty(vueInstance, key, descriptor);
	})(targetPrototype);

	decorate(targetPrototype, key);
    return desc;
}

var decorate = (targetPrototype, key) => {
	targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
	targetPrototype.$$vuejsext.decorate = targetPrototype.$$vuejsext.decorate || {};
	targetPrototype.$$vuejsext.decorate[key] = true;
}

var isDecorate = (targetPrototype, key) => targetPrototype.$$vuejsext && targetPrototype.$$vuejsext.decorate && targetPrototype.$$vuejsext.decorate[key];

var init = (callback: (data) => void) => (targetPrototype) => {
	targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.init = targetPrototype.$$vuejsext.init || [];
    targetPrototype.$$vuejsext.init.push(callback);
}

var beforeMount = (callback: (vueInstance) => void) => (targetPrototype) => {
	targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.beforeMount = targetPrototype.$$vuejsext.beforeMount || [];
    targetPrototype.$$vuejsext.beforeMount.push(callback);
}

var computedDecorator = (targetPrototype, key) => {
	decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.computed = targetPrototype.$$vuejsext.computed || {};
    targetPrototype.$$vuejsext.computed[key] = function () { 
        return this.$data.$$targetInstance[key];
    }
}

var watchDecorator = (name: string) => (targetPrototype, key, desc) => {
	decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.watch = targetPrototype.$$vuejsext.watch || {};
    targetPrototype.$$vuejsext.watch[`zyx123values.${name}`] = function () { 
        this.$data.$$targetInstance[key]();
    }
}

var methodDecorator = (targetPrototype, key, desc) => {
	decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.methods = targetPrototype.$$vuejsext.methods || {};
    targetPrototype.$$vuejsext.methods[key] = function () { 
        this.$data.$$targetInstance[key].apply(this.$data.$$targetInstance, arguments);
    }
}

var eventDecorator = (targetPrototype, key, desc) => {
	decorate(targetPrototype, key);
    methodDecorator(targetPrototype, key, desc);
    var _super = desc.value;
    desc.value = function() {
        var result = _super.apply(this, arguments);
        this.$vuedata.$vuejs && this.$vuedata.$vuejs.then(vuejs => vuejs.$emit(key, result));
        return result;
    }
}

var propDecorator = (targetPrototype, key, desc?) => {
    var desc = desc || {};
    var setter = desc && desc.set;
    desc.set = function () {
        setter && setter.apply(this, arguments);
        this.$vuedata[key] !== arguments[0] && (this.$vuedata[key] = arguments[0]);
    }
	decorate(targetPrototype, key);
    targetPrototype.$$vuejsext = targetPrototype.$$vuejsext || {}; 
    targetPrototype.$$vuejsext.props = targetPrototype.$$vuejsext.props || {};
    targetPrototype.$$vuejsext.props[key] = {};
	return desc;
}

var setDefaultConfig = (target) => {
	var targetPrototype = target.prototype;
	Object.keys(targetPrototype).forEach(key => {
		if (!isDecorate(targetPrototype, key)) {
			var descriptor = Object.getOwnPropertyDescriptor(targetPrototype, key);
			if (descriptor.get && descriptor.set) {
				Object.defineProperty(targetPrototype, key, dataDecorator(targetPrototype, key, descriptor));
			} else if (descriptor.set) {
				Object.defineProperty(targetPrototype, key, propDecorator(targetPrototype, key, descriptor));
			} else if (descriptor.get) {
				computedDecorator(targetPrototype, key);
			}
		}
	});
}

var GetVueConfig = (options: {el?: string; name?: string; html: Promise<string>}) => (target) => {
	setDefaultConfig(target);
    target.prototype.$$vuejsext = target.prototype.$$vuejsext || {};
    var data = target.prototype.$$vuejsext.data || {};
    var computed = target.prototype.$$vuejsext.computed || {};
    var watch: any = target.prototype.$$vuejsext.watch || {};
    var props  = target.prototype.$$vuejsext.props || {};
    var methods  = target.prototype.$$vuejsext.methods || {};
    var html = options.html;
    var el = options.el;
	var inits  = target.prototype.$$vuejsext.init || [];
	var beforeMounts  = target.prototype.$$vuejsext.beforeMount || [];
    var initValues = (d) => inits.forEach((fn) => fn(d));
    var beforeMount = function () { beforeMounts.forEach((fn) => fn(this)); }

    return {
        data: data,
        computed: computed,
        watch: watch,
        props: props,
        methods: methods,
        html: html,
        el: el,
        initValues: initValues,
        beforeMount: beforeMount,
        setVueInstance: (d, vi: Promise<any>) => d.$vuejs = vi
    };
}

var ComponentDecorator = (options: {name: string; html: Promise<string>}) => (target) => {
    var config = GetVueConfig(options)(target);
    delete config.el;

    Vue.component(options.name, (resolve) => {
        config.html.then(template => resolve(Object.assign({}, config, {
            template: template,
            data: function () {
                var instance = new target();
                var d: any = {};
                d.$$targetInstance = instance;
                instance.$vuedata = d;
                config.initValues(d);
                config.setVueInstance(d, Promise.resolve(this));
                return d;
            }
        })));
    });
}

var VueDecorator = (options: {el: string, html: Promise<string>}) => (target) => {
    var config = GetVueConfig(options)(target);

    var result = (new Function('constructor', `return function ${target.name}() { constructor(this, arguments); };`))(
        function (instance, args) {
            var d:any = {};
            d.$$targetInstance = instance;
            instance.$vuedata = d;
            var instance = target.apply(instance, args) || instance;
            config.initValues(d);
            config.setVueInstance(d, config.html.then(template => new Vue(Object.assign({}, config, {
                el: config.el || createElement(template),
                data: d,
                template: config.el && template || undefined
            }))));
        });
    Object.setPrototypeOf(result, target);
    function __() { this.constructor = result; }
    result.prototype = target === null ? Object.create(target) : (__.prototype = target.prototype, new __());
    return result;
}

@ComponentDecorator({
    name:"info",
    html: Promise.resolve(`
        <div>
            <input v-model="lastName" @input="change"/> <br/>
            <input v-model="firstName" @input="change"/> <br/>
            <span>id({{id}}) : {{fullName}}</span>
        </div>
    `)
})
class Test {
    @propDecorator
    private id: number;
    @dataDecorator
    private lastName: string;
    @dataDecorator
    private firstName: string;
    @computedDecorator
    private get fullName(): string { return `${this.lastName} ${this.firstName}`; }
    @watchDecorator("lastName")
    log() {
        console.log("le nom a changé");
    }

    @eventDecorator
    change() {
        return this.fullName;
    }
}

@ComponentDecorator({
    name:"property",
    html: Promise.resolve(`
        <div>
			Property <br/>
            <input v-model="lastName"/> <br/>
            <input v-model="firstName"/> <br/>
            <span>id({{id}}) : {{fullName}}</span>
        </div>
    `)
})
class Property {
	private _lastName: string;
    private _firstName: string;
	
	@propDecorator
    private set id(value: number) {}
	
	@dataDecorator
	private set lastName(value: string) { this._lastName = value; }
	private get lastName(): string { return this._lastName; }
	@dataDecorator
	private set firstName(value: string) { this._firstName = value; }
	private get firstName(): string { return this._firstName; }
	
	@computedDecorator
    private get fullName(): string { return `${this.lastName} ${this.firstName}`; }
}

@ComponentDecorator({
    name:"defaut",
    html: Promise.resolve(`
        <div>
			Defaut <br/>
            <input v-model="lastName"/> <br/>
            <input v-model="firstName"/> <br/>
            <span>id({{id}}) : {{fullName}}</span>
        </div>
    `)
})
class Defaut {
	private _lastName: string;
    private _firstName: string;
	
    private set id(value: number) {}
	
	private set lastName(value: string) { this._lastName = value; }
	private get lastName(): string { return this._lastName; }
	private set firstName(value: string) { this._firstName = value; }
	private get firstName(): string { return this._firstName; }
	
    private get fullName(): string { return `${this.lastName} ${this.firstName}`; }
}

@VueDecorator({
    el: "#app",
    html: Promise.resolve(`
    <div>
        <info id='1234' @change="log"/>
		<property id='75' />
		<defaut id='5678' />
    </div>
    `)
})
class App {
    @methodDecorator
    log(value) {
        console.log(value);
    }
}

new App();

