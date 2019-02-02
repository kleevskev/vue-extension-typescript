import { View, start, methods, computed } from '../../dist/vue-extention-typescript';

@View({
    html: "<div>message = {{ message }} et message2 = {{ message2 }} <input v-model='message'></div>"
})
class Test {
    message: string = "start";
    constructor() {
    }

    @computed
    message2() {
        return `${this.message} test`;
    }
}

start(Test, document.getElementById("app"));