import { View, Directive, Component, start, methods, computed, props, event } from '../../dist/vue-extension-typescript';

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
    html: Promise.resolve(`<div>composant {{data}} {{label}}</div>`)
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
    html: Promise.resolve(`
    <div>
        <div>message = {{ message }}</div>
        <div>calcule = {{ calcule }}</div>
        <div v-test="result" >result = {{ result }}</div>
        <input v-model='message'>
        <vc-test :data="calcule" :label="result"></vc-test>
    </div>
    `)
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
