const tap = require('tap');
const FunctionCache = require('../');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

tap.test('memo', async t => {
  let cache = new FunctionCache();
  let called = 0;
  const fP = async() => {
    called++;
    await wait(100);
    return 21;
  };
  let r1 = await cache.memo('memo1', fP);
  t.equal(called, 1);
  t.equal(r1, 21);
  r1 = await cache.memo('memo1', fP);
  t.equal(called, 1);
  t.equal(r1, 21);
  cache = new FunctionCache(true);
  r1 = await cache.memo('memo1', fP, 100, true);
  t.equal(called, 2);
  t.equal(r1, 21);
  await wait(110);
  r1 = await cache.memo('memo1', fP);
  await wait(500); // wait for function to be called
  t.equal(called, 3);
  t.equal(r1, 21);
  t.end();
});
