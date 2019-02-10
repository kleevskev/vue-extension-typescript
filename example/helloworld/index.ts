import { View, Component, start, methods, computed, props, event } from '../../dist/vue-extension-typescript';
declare let Vue: any;

class Base {}

@Component({
    name: "text-box",
    html: `<div>
        <input type='text' v-model='saisie' @input="input"/>
        <span>la valeur saisie est {{saisie}}</span>
        <div></div>
    </div>`
})
class TextBox {
    @props({ name: "value" })
    private saisie = "default";

    @event({ name: "input" })
    private input(event) {
        return event.target.value;
    }
}

@View({
    html: "<div>sous vue</div>"
})
class SousVue {
}

@View({
    html: `
    <div>
        <div>message = {{ message }} et message2 = {{ message2 }}</div>
        <input v-model='message'>
        <div v-view='child'></div>
        <vc-text-box v-model="message"></vc-text-box>
    </div>
    `
})
class Test extends Base {
    message: string = "start";
    constructor(private child: SousVue) {
        super();
    }

    @computed
    message2() {
        return `${this.message} test`;
    }
}

start(Base, document.getElementById("app"));
