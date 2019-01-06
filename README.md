# cached-function

Incredibly simple caching wrapper around any asynchronous function


## Install

This module doesn't have any dependencies but it only works with node 10+ because it uses `async/await`

```
$ npm install cached-function
```


## Usage

```js
const cached = require('@piuccio/cached-function');
const fn = cached('./cache.json', async (url) {
  const { body } = await got(url);
  return body.slice(0, 100);
});

await fn('https://google.com'); // The first time it'll actually make a request
await fn('https://google.com'); // The second time it'll grab the response from cache

// In both cases the function returns the same response
```

The cache is is the first argument to the wrapped function so

```js
await fn('https://google.com');
await fn('https://amazon.com');
// Will both make an actual request
```
