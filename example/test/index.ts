import { View, Directive, Component, start, methods, computed, props, event } from '../../dist/vue-extension-typescript';
declare let Vue: any;

// Vue.directive("test", {
//     bind: (el, binding) => {
//         console.log("first " + binding.value);
//     },

//     update: (el, binding) => {
//         console.log(binding.value);
//     }
// });

// new Vue({
//     el: "#app",
//     data: {
//         message: "start",
//         result: "resultat"
//     },
//     template: `
//         <div>
//             <div>message = {{ message }}</div>
//             <div v-test="result" >message = {{ result }}</div>
//             <input v-model='message'>
//         </div>
//         `
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
    html: `<div>composant</div>`
})
class Comp {
    @props({ name: "value" })
    prop = 'test';

    @props({ name: "autre" })
    test = 'test';
}

@View({
    html: `
    <div>
        <div>message = {{ message }}</div>
        <div>message = {{ calcule }}</div>
        <div v-test="result" >message = {{ result }}</div>
        <input v-model='message'>
        <vc-test></vc-test>
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
