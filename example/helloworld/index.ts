import { View, start, methods, computed } from '../../dist/vue-extention-typescript';

class Base {}

@View({
    html: "<div>sous vue</div>"
})
class SousVue {
}

@View({
    html: "<div>message = {{ message }} et message2 = {{ message2 }} <input v-model='message'><div v-view='child'></div></div>"
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

start(Test, document.getElementById("app"));
