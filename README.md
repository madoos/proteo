# proteo

>

In Greek mythology, Proteo is a god of the sea that can take any form.

The library allows to obtain metaprogrammed structures to easily imitate existing apis

## Installation

```sh
$ npm install --save proteo
```

## Usage

```js
const proteo = require("proteo")
const api = proteo()
api.a.b().c.d()
```

```javascript
const rx = proteo({
  when: prop => prop === "subscribe",
  value: prop => next => next(6)
})

rx.Observable.from([1, 2])
  .map(double)
  .reduce(add)
  .subscribe(n => console.log(n)) // 6

console.log(rx.calls.get())
/*

{
  map: [[double]],
  reduce: [[add]]
}

*/
```

```javascript
const res = proteo({
  when: prop => prop === "send",
  value: prop => data => data
})

res.status(200).send({ data: true })

console.log(rx.calls.get())
/*
{
  status: [[200]],
  send: [[{ data: true }]]
}
*/
```

## Options

```javascript

const api = proteo({
  when: (prop) => prop === "finish" // condition to stop chain
  value: () => true // value returned
  store: "customName" // name for store calls
})

api.a.b().c.finish // true
api.customName.get() // get calla
api.customName.clear() // clear calls


```

## License

MIT © [Maurice Domínguez]()
