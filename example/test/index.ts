import { View, Directive, Component, start, methods, computed, props, event } from '../../dist/vue-extension-typescript';
declare let Vue: any;

// Vue.directive("test", {
    // bind: (el, binding) => {
        // console.log("first " + binding.value);
    // },

    // update: (el, binding) => {
        // console.log(binding.value);
    // }
// });

// var instance = new Vue({
    // el: "#app",
    // data: { instance_extension_vuejs: data },
	// computed: Object.assign({}, vueData, {
		// calcule: {
			// get: function() { return `(${this._data.instance_extension_vuejs.message})`; }
		// }
	// }),
    // template: `
        // <div>
            // <div>message = {{ message }}</div>
			// <div>message = {{ calcule }}</div>
            // <div v-test="result" >message = {{ result }}</div>
            // <input v-model='message'>
        // </div>
        // `
// });

@Directive({ name: "test" })
class Dir {
    bind(el, binding) {
        this.update(el, binding);
    }

    update(el, binding) {
        console.log(binding.value);
    }
}

@Component({ 
    name: "test", 
    html: `<div>composant {{data}} {{label}}</div>`
})
class Comp {
    @props
    data = 'test';

	@props
	label = "titre";
	
    @props({ name: "value" })
    test = 'test autre';
}

@View({
    html: `
    <div>
        <div>message = {{ message }}</div>
        <div>calcule = {{ calcule }}</div>
        <div v-test="result" >result = {{ result }}</div>
        <input v-model='message'>
        <vc-test :data="calcule" :label="result"></vc-test>
    </div>
    `
})
class Test {
    message: string = "start";
    result = "resultat";
	
    constructor() {
    }

    @computed
    calcule() {
        return `(${this.message})`;
    }
}

start(Test, document.getElementById("app"));
