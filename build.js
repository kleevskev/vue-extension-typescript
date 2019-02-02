module.exports = {
    "main": "lib/index.js",
    "out": "dist/vue-extention-typescript.js",
    "decorator": true,
    "config": { 
        "name": "VueTs",
        "path": [
            { test: /^\/?(node_modules\/*)/, result: "/$1" },
            { test: /^\/?(core\/*)/, result: "/lib/$1" }
        ]
    }
}