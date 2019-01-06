const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function openCache(file) {
  try {
    const data = await readFile(file);
    return JSON.parse(data);
  } catch (ex) {
    return {};
  }
}

async function flush(file, content) {
  if (!file) throw new Error('Missing file cache');
  return writeFile(file, JSON.stringify(content, null, 2));
}

module.exports = (cacheFile, fn) => {
  const newFn = async (first, ...others) => {
    const cache = await openCache(cacheFile);
    if (first in cache) {
      return cache[first];
    }
    const result = await fn(first, ...others);
    cache[first] = result;
    flush(cacheFile, cache);
    return result;
  };
  newFn.clear = async () => {
    await flush(cacheFile, {});
  };
  return newFn;
};
