const path = require('path');
const cached = require('../index');

jest.mock('fs', () => {
  const storage = {};
  return {
    writeFile(name, data, cb) {
      storage[name] = data;
      cb();
    },
    readFile(name, cb) {
      return cb(null, storage[name]);
    },
  };
});

describe('cached-function', () => {
  it('saves the result to file', async () => {
    let counter = 0;
    function fn(number) {
      counter += 1;
      return Promise.resolve(counter * number);
    }
    const wrapped = cached(path.join(__dirname, '../cache.json'), fn);
    await wrapped.clear();

    // Expect the first call to go as planned
    const firstResponse = await wrapped(3);
    expect(counter).toBe(1);
    expect(firstResponse).toBe(3);

    // The first argument is the cache key
    const otherResponse = await wrapped(2);
    expect(counter).toBe(2);
    expect(otherResponse).toBe(4);

    // The second time it should be from cache
    const secondResponse = await wrapped(3);
    expect(counter).toBe(2);
    expect(secondResponse).toBe(3); // instead of 6
  });
});
