import { View, Component, start, data, methods, computed, props, event } from '../../dist/vue-extension-typescript';
declare let Vue: any;

class Base {}

@Component({
    name: "text-box",
    html: Promise.resolve(`<div>
        <input type='text' v-model="data"  @input="input"/>
        <span>la valeur saisie est {{value}}</span>
        <div></div>
    </div>`)
})
class TextBox {
    private _data = null;
    private set value(v) { this.data = v; }
    private set data(v) { this._data = v; };
	private get data() { return this._data; };

    @event
    private input(event) {
        return event.target.value;
    }
}

@View({
    el: "#app",
    html: Promise.resolve(`
    <div>
        <div>message = {{ message }} et message2 = {{ message2 }}</div>
        <input v-model='message'>
        <text-box v-model="message"></text-box>
    </div>
    `)
})
class Test extends Base {
    @data
    message: string = "start";
    constructor() {
        super();
    }

    get message2() {
        return `${this.message} test`;
    }
}

start(Test);