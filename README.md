
# vue-extension-typescript

La librairie **vue-extension-typescript** est une extension qui permet d'écrire des application **vuejs** à l'aide de **typescript**.  Pour fonctionner les flags `--experimentalDecorators` et `--emitDecoratorMetadata` doivent être activés.

La librairie fournit des décorateurs pour construire des vues à l'aide de *class* typescript et un système d'injection de dépendance.

## Contenu

### @View (options: ViewOptions)
```typescript
interface ViewOptions {
	view: string | Promise<string> // template html ou promesse retournant le template html
}
```
Permet de définir une classe comme étant une Vue au sens de **vuejs**.
### @Directive (options: DirectiveOptions)
```typescript
interface DirectiveOptions {
	name: string // nom de la directive
}
```
Permet de définir une classe comme étant une Directive au sens de **vuejs**.
### @Service(options: ServiceOptions\<T\>)
```typescript
interface ServiceOptions<T> {
	key: { prototype: T }, // classe dont on veut obtenir une instance
	cachable?:  boolean, // si cachable==true : enregistre l'instance de la classe et renvoie toujours la même, sinon crée toujours une nouvelle instance
	initialize?: (instance:  T) =>  void, // méthode d'initialisation appelée à chaque fois qu'une instance est construite 
}
```
Permet de définir une classe comme étant un service injectable (dans les vues, directives et autres services).

### @computed
Permet de définir un propriété d'une classe comme étant un champ calculé au sens de **vuejs**.

### @methods
Permet de définir un propriété d'une classe comme étant une méthode au sens de **vuejs**. Toutes les méthodes d'une classe décorées avec **@View** sont par défaut des méthodes.

### IServiceProvider
Le service maître du système d'injection de dépendance qui permet de créer des instances de service ou récupérer les instances déjà créée.

### function  start(target: Function, element: Element)
La méthode start est le point d'entrée de l'application.

## Exemples
### Basique
```typescript
import { View, start } from  'vue-extention-typescript';

@View({
	html:  "<div><input v-model='message'> message = {{ message }} </div>"
})
class  Test {
	message =  "Hello world";
}

start(Test, document.getElementById("app"));
```

### Directive personnalisée
```typescript
import { View, Directive, start } from  'vue-extention-typescript';

@Directive({ name: "colorblue" })
ColorBlue {
	bind(el) {
		el.styles.color = "blue";
	}
}

@View({
	html:  "<div>message = <span v-colorblue>{{ message }}</span></div>"
})
class  Test {
	message =  "Hello world";
}

start(Test, document.getElementById("app"));
```
### Service
```typescript
import { View, Service, start } from  'vue-extention-typescript';

@Service({ key: MyService })
class MyService{
	getMessage() {
		return "Hello world";
	}
}

@View({
	html:  "<div>message = {{ message }}</div>"
})
class  Test {
	message: string;
	constructor(myService: MyService) {
		this.message = myService.getMessage();
	}
}

start(Test, document.getElementById("app"));
```

### Propriété calculée
```typescript
import { View, computed, start } from  'vue-extention-typescript';

@View({
	html:  "<div>{{ hello }}, {{ whoiam }}</div>"
})
class  Test {
	hello= "Hello world";

	@computed
	whoiam() {
		return "I am Bob";
	}
}

start(Test, document.getElementById("app"));
```
### Méthode
```typescript
import { View, methods, start } from  'vue-extention-typescript';

@View({
	html:  "<div>{{ hello }}, {{ whoiam() }}, {{ profession() }}</div>"
})
class  Test {
	hello= "Hello world";

	@methods
	whoiam() {
		return "I am Bob";
	}
	
	profession() {
		return "I am web developper";
	}
}

start(Test, document.getElementById("app"));
```


# vue-extension-typescript

La librairie **vue-extension-typescript** est une extension qui permet d'écrire des application **vuejs** à l'aide de **typescript**.  Pour fonctionner les flags `--experimentalDecorators` et `--emitDecoratorMetadata` doivent être activés.

La librairie fournit des décorateurs pour construire des vues à l'aide de *class* typescript et un système d'injection de dépendance.

## Contenu

### @View (options: ViewOptions)
```typescript
interface ViewOptions {
	view: string | Promise<string> // template html ou promesse retournant le template html
}
```
Permet de définir une classe comme étant une Vue au sens de **vuejs**.
### @Directive (options: DirectiveOptions)
```typescript
interface DirectiveOptions {
	name: string // nom de la directive
}
```
Permet de définir une classe comme étant une Directive au sens de **vuejs**.
### @Service(options: ServiceOptions\<T\>)
```typescript
interface ServiceOptions<T> {
	key: { prototype: T }, // classe dont on veut obtenir une instance
	cachable?:  boolean, // si cachable==true : enregistre l'instance de la classe et renvoie toujours la même, sinon crée toujours une nouvelle instance
	initialize?: (instance:  T) =>  void, // méthode d'initialisation appelée à chaque fois qu'une instance est construite 
}
```
Permet de définir une classe comme étant un service injectable (dans les vues, directives et autres services).

### @computed
Permet de définir un propriété d'une classe comme étant un champ calculé au sens de **vuejs**.

### @methods
Permet de définir un propriété d'une classe comme étant une méthode au sens de **vuejs**. Toutes les méthodes d'une classe décorées avec **@View** sont par défaut des méthodes.

### function  start(target: Function, element: Element)
La méthode start est le point d'entrée de l'application.

## Exemples
### Basique
```typescript
import { View, start } from  'vue-extention-typescript';

@View({
	html:  "<div><input v-model='message'> message = {{ message }} </div>"
})
class  Test {
	message =  "Hello world";
}

start(Test, document.getElementById("app"));
```

### Directive personnalisée
```typescript
import { View, Directive, start } from  'vue-extention-typescript';

@Directive({ name: "colorblue" })
ColorBlue {
	bind(el) {
		el.styles.color = "blue";
	}
}

@View({
	html:  "<div>message = <span v-colorblue>{{ message }}</span></div>"
})
class  Test {
	message =  "Hello world";
}

start(Test, document.getElementById("app"));
```
### Service
```typescript
import { View, Service, start } from  'vue-extention-typescript';

@Service({ key: MyService })
class MyService{
	getMessage() {
		return "Hello world";
	}
}

@View({
	html:  "<div>message = {{ message }}</div>"
})
class  Test {
	message: string;
	constructor(myService: MyService) {
		this.message = myService.getMessage();
	}
}

start(Test, document.getElementById("app"));
```

### Propriété calculée
```typescript
import { View, computed, start } from  'vue-extention-typescript';

@View({
	html:  "<div>{{ hello }}, {{ whoiam }}</div>"
})
class  Test {
	hello= "Hello world";

	@computed
	whoiam() {
		return "I am Bob";
	}
}

start(Test, document.getElementById("app"));
```
### Sous vue
```typescript
import { View, start } from  'vue-extention-typescript';

@View({
	html:  "<div><h1>{{ message }}</h1></div>"
})
class  MyChildView{
	message= "I am the child view";
}

@View({
	html:  "<div><h1>{{ message }}</h1><div v-view='child'></div></div>"
})
class  MyView{
	message= "I am the parent view";
	constructor(private child: MyChildView) {
	}
}

start(MyView, document.getElementById("app"));
```
