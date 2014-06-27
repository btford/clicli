# clicli

makes _literally any node module\*_ into a CLI tool

\*some node modules

## install

```shell
$ npm install -g clicli
```


## use

this:

```shell
$ cli kawaii spiders
```

does this:

```javascript
console.log(require('kawaii')('spiders'));
```


## how does it work?

it's like doing

```javascript
console.log(require(process.argv[1]).apply(null, process.argv.slice(2)));
```

but it'll also npm install the module somewhere nice first


## license
MIT
