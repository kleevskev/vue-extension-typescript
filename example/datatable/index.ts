import { View, Directive, Component, start, methods, computed, props, event } from '../../dist/vue-extension-typescript';
declare let Vue: any, $: any;

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

@Directive({ name: "datatable" })
class Datatable {
    bind(el, binding) {
        setTimeout(() => $(el).DataTable(), 3000);
    }

    update(el, binding) {
        $(el).DataTable({
            "createdRow": function( row, data, dataIndex ) {
                var tr = this.fnSettings().aoData[dataIndex].nTr;
                this.fnSettings().aoData[dataIndex].nTr = new Vue({
                    el: tr,
                    data: data
                }).$el;
            }
        });
        var table = $(el).DataTable();
        table.clear();
        binding.value.forEach(element => {
            table.row.add(element);
        });
        table.draw();
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
        <table v-datatable="items" class="table">
            <thead>
                <tr>
                    <th data-data="id">Id</th>
                    <th data-data="nom">Nom</th>
                </tr>
            </thead>
        </table>
    </div>
    `
})
class Test {
    message: string = "start";
    result = "resultat";
    items = [
        { id: 1, nom: 'test 1' },
        { id: 1, nom: 'test 2' },
        { id: 1, nom: 'test 3' },
        { id: 1, nom: 'test 4' },
        { id: 1, nom: 'test 5' },
        { id: 1, nom: 'test 1' },
        { id: 1, nom: 'test 2' },
        { id: 1, nom: 'test 3' },
        { id: 1, nom: 'test 4' },
        { id: 1, nom: 'test 5' },
        { id: 1, nom: 'test 1' },
        { id: 1, nom: 'test 2' },
        { id: 1, nom: 'test 3' },
        { id: 1, nom: 'test 4' },
        { id: 1, nom: 'test 5' }
    ];
    constructor() {
    }

    @computed
    calcule() {
        return `(${this.message})`;
    }
}

start(Test, document.getElementById("app"));
