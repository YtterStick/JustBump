const assert = require('node:assert');

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function http(path, opts = {}) {
  const res = await fetch(BASE + path, opts);
  const text = await res.text().catch(() => null);
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  return { status: res.status, headers: res.headers, body, rawText: text };
}

async function waitForServer(timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const r = await http('/api/cards');
      if (r.status === 200) return true;
    } catch (e) {
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Server did not respond in time');
}


(async () => {
  console.log('Running API tests against', BASE);
  try {
    await waitForServer();

    const uniq = Date.now();
    const email = `andreidilag12@gmail.com`;
    const password = `!Ytterbium${uniq}`;
    const r = await http('/api/auth/reigster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, phone_number: '09150475513' })
    });
    assert.strictEqual(r.status, 201, `register failed: ${r.status} ${r.rawText}`);
    console.log('✔ register');

    r = await http('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    assert.strictEqual(r.status, 200, `login failed: ${r.status} ${r.rawText}`);
    const token = r.body && r.body.token;
    assert.ok(token, 'no token returned');
    console.log('✔ login');

    const authHeader = { Authorization: `Bearer ${token}` };

    r = await http('/api/auth/me', { method: 'GET', headers: authHeader });
    assert.strictEqual(r.status, 200, `me failed: ${r.status} ${r.rawText}`);
    assert.strictEqual(r.body.email, email, 'me returned wrong email');
    console.log('✔ me');

    const slug = `test-card-${uniq}`;
    r = await http('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ full_name: 'API Tester', slug })
    });
    assert.strictEqual(r.status, 201, `create card failed: ${r.status} ${r.rawText}`);
    const cardId = r.body && r.body.id;
    assert.ok(cardId, 'no card id returned');
    console.log('✔ create card');

    r = await http('/api/cards', { method: 'GET' });
    assert.strictEqual(r.status, 200, `list cards failed: ${r.status}`);
    const found = Array.isArray(r.body) && r.body.some((c) => c.slug === slug);
    assert.ok(found, 'created card not found in list');
    console.log('✔ list cards');

    r = await http(`/api/cards/${cardId}`, { method: 'GET' });
    assert.strictEqual(r.status, 200, `get card failed: ${r.status}`);
    assert.strictEqual(r.body.full_name, 'API Tester');
    console.log('✔ get card');

    r = await http(`/api/cards/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ full_name: 'API Tester Updated' })
    });
    assert.strictEqual(r.status, 200, `update card failed: ${r.status}`);
    assert.ok(r.body.ok, 'update did not return ok');

    r = await http(`/api/cards/${cardId}`, { method: 'GET' });
    assert.strictEqual(r.body.full_name, 'API Tester Updated');
    console.log('✔ update card');

    r = await http(`/api/cards/${cardId}`, { method: 'DELETE', headers: authHeader });
    assert.strictEqual(r.status, 200, `delete card failed: ${r.status}`);
    assert.ok(r.body.ok, 'delete did not return ok');

    r = await http(`/api/cards/${cardId}`, { method: 'GET' });
    assert.strictEqual(r.status, 404, 'deleted card still accessible');
    console.log('✔ delete card');

    console.log('\nAll API tests passed ✅');
    process.exit(0);
  } catch (err) {
    console.error('\nAPI tests failed ✖', err);
    process.exit(1);
  }
})();
