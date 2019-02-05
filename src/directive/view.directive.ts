import { Directive } from '../decorator/directive'

@Directive({ name: "view" })
class ViewDirective {
    bind(el, binding, vnode) {
        this.update(el, binding, vnode);
    }

    update(el, binding, vnode) {
        if (binding.value && binding.value.$vuejs && binding.value.$vuejs.then) {
            binding.value.$vuejs.then(_ => {
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
                el.appendChild(_.$el);
            });
        } else {
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		}
    }
}