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
        return getter ? getter.apply(this, arguments) : this.$vuedata.zyx123values[key];
    }
    desc.set = function () {
        setter && setter.apply(this, arguments);
        this.$vuedata.zyx123values[key] = setter ? this[key] : arguments[0];
        // this.$vuedata[key] !== arguments[0] && (this.$vuedata[key] = arguments[0]);
    }
    targetPrototype.__vuejsext = targetPrototype.__vuejsext || {}; 
    targetPrototype.__vuejsext.data = targetPrototype.__vuejsext.data || {};
    targetPrototype.__vuejsext.data[key] = { 
        beforeCreate: data => {
            data.zyx123values = data.zyx123values || {};
            data.zyx123values[key] = data._instance_[key] != undefined ? data._instance_[key] : null; 
        },
        beforeMount: vueInstance => { 
            var descriptor: any = {};
            descriptor.set = function () { 
                vueInstance.$data._instance_[key] = arguments[0];
            }
            descriptor.get = function () { 
                return vueInstance.$data.zyx123values[key];
            }
            Object.defineProperty(vueInstance, key, descriptor);
        }
    };
    return desc;
}

var computedDecorator = (targetPrototype, key) => {
    targetPrototype.__vuejsext = targetPrototype.__vuejsext || {}; 
    targetPrototype.__vuejsext.computed = targetPrototype.__vuejsext.computed || {};
    targetPrototype.__vuejsext.computed[key] = function () { 
        return this.$data._instance_[key];
    }
}

var watchDecorator = (name: string) => (targetPrototype, key) => {
    targetPrototype.__vuejsext = targetPrototype.__vuejsext || {}; 
    targetPrototype.__vuejsext.watch = targetPrototype.__vuejsext.watch || {};
    targetPrototype.__vuejsext.watch[name] = function () { 
        this.$data._instance_[key]();
    }
}

var methodDecorator = (targetPrototype, key) => {
    targetPrototype.__vuejsext = targetPrototype.__vuejsext || {}; 
    targetPrototype.__vuejsext.methods = targetPrototype.__vuejsext.methods || {};
    targetPrototype.__vuejsext.methods[key] = function () { 
        this.$data._instance_[key].apply(this.$data._instance_, arguments);
    }
}

var eventDecorator = (targetPrototype, key, desc) => {
    methodDecorator(targetPrototype, key);
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
    targetPrototype.__vuejsext = targetPrototype.__vuejsext || {}; 
    targetPrototype.__vuejsext.props = targetPrototype.__vuejsext.props || {};
    targetPrototype.__vuejsext.props[key] = {};
}

var GetVueConfig = (options: {el?: string; name?: string; html: Promise<string>}) => (target) => {
    target.prototype.__vuejsext = target.prototype.__vuejsext || {};
    var data = target.prototype.__vuejsext.data || {};
    var computed = target.prototype.__vuejsext.computed || {};
    var watch: any = target.prototype.__vuejsext.watch || {};
    var props  = target.prototype.__vuejsext.props || {};
    var methods  = target.prototype.__vuejsext.methods || {};
    var html = options.html;
    var el = options.el;
    var initValues = function (d) {
        Object.keys(data).forEach((key) => data[key].beforeCreate(d));
    }
    var beforeMount = function () {
        Object.keys(data).forEach((key) => data[key].beforeMount(this));
    }
    
    // // Object.keys(data).forEach((key) => {
    // //     var _super = watch[key];
    // //     watch[key] = function () {
    // //         _super && _super.apply(this, arguments);
    // //         this.$data._instance_[key] = this[key];
    // //     }
    // // });

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
        // mapper: (instance) => Object.keys(data).forEach((key) => data[key](instance)),
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
                d._instance_ = instance;
                instance.$vuedata = d;
                config.initValues(d);
                // config.mapper(instance);
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
            d._instance_ = instance;
            instance.$vuedata = d;
            var instance = target.apply(instance, args) || instance;
            config.initValues(d);
            // config.mapper(instance);
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

@VueDecorator({
    el: "#app",
    html: Promise.resolve(`
    <div>
        <info id='1234' @change="log"/>
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

