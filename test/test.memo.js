const tap = require('tap');
const FunctionCache = require('../');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


tap.test('memo', async t => {
  const cache = new FunctionCache(false);
  let called = 0;
  const fP = async() => {
    called++;
    await wait(150);
    return called;
  };
  const r1 = await cache.memo('memo1', fP, 100);
  t.equal(r1, 1, 'first time it will invoke function and return value');
  const r2 = await cache.memo('memo1', fP);
  t.equal(r2, 1, 'second time it will return cached value');
  await wait(510); // wait until after ttl:
  const t1 = new Date().getTime();
  const r3 = await cache.memo('memo1', fP);
  const t2 = new Date().getTime();
  t.ok(t2 - t1 > 100, 'if not in fastMode the function refreshes after ttl has expired');
  t.equal(r3, 2, 'it will now have the cached value');
  t.end();
});

tap.test('memo with fastMode', async t => {
  const cache = new FunctionCache(true);
  let called = 0;
  const fP = async() => {
    called++;
    await wait(110);
    return called;
  };
  let t1 = new Date().getTime();
  const r1 = await cache.memo('memo1', fP, 500);
  let t2 = new Date().getTime();
  t.ok((t2 - t1) > 100, 'invokes function first time it is memoed');
  t.equal(r1, 1, 'first time it will invoke function and return value');
  t1 = new Date().getTime();
  const r2 = await cache.memo('memo1', fP);
  t2 = new Date().getTime();
  t.ok((t2 - t1) < 100, 'does not invoke function second time');
  t.equal(r2, 1, 'second time it will return cached value');
  await wait(510); // wait until after ttl:
  t1 = new Date().getTime();
  const r3 = await cache.memo('memo1', fP);
  t2 = new Date().getTime();
  t.ok((t2 - t1) < 100, 'in fastMode mode it returns immediately even after ttl');
  t.equal(r3, 1, 'after ttl it will still return the previously-cached value');
  await wait(500); // wait for function to be called
  t1 = new Date().getTime();
  const r4 = await cache.memo('memo1', fP);
  t2 = new Date().getTime();
  t.ok((t2 - t1) < 100, 'it returns immediately because function was re-memoed last time we called it');
  t.equal(r4, 2, 'next time it is called it should have the refreshed value');
  t.end();
});
