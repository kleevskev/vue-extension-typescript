import { View, Component, start, methods, computed } from '../../dist/vue-extension-typescript';

class Base {}

@Component({
    name: "text-box",
    html: "<div><input type='text' v-model='value'/></div>"
})
class TextBox {
    private value = "default";
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
        <vc-text-box></vc-text-box>
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
