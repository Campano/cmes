import assert from 'node:assert/strict';
import { createSign, generateKeyPairSync } from 'node:crypto';
import { test } from 'node:test';
import { check, teamUrl } from './auth.js';

const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = publicKey.export({ format: 'jwk' });
jwk.kid = 'test-key';
jwk.alg = 'RS256';
jwk.use = 'sig';

const b64url = (value) => Buffer.from(value).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const header = { alg: 'RS256', kid: 'test-key' };
const env = {
  CF_ACCESS_TEAM_DOMAIN: 'cmes',
  CF_ACCESS_AUD: 'aud-tag',
  GITHUB_TOKEN: 'ghp_test',
};

function sign(claims) {
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(claims));
  const signer = createSign('RSA-SHA256');
  signer.update(`${h}.${p}`);
  signer.end();
  return `${h}.${p}.${signer.sign(privateKey).toString('base64url')}`;
}

function claims(over = {}) {
  return {
    iss: 'https://cmes.cloudflareaccess.com',
    aud: 'aud-tag',
    exp: now + 3600,
    nbf: now - 10,
    ...over,
  };
}

function request(jwt) {
  return { headers: { get: (name) => (name === 'Cf-Access-Jwt-Assertion' ? jwt : null) } };
}

function withCerts(t) {
  const original = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = original;
  });
  globalThis.fetch = async () => ({ json: async () => ({ keys: [jwk] }) });
}

test('teamUrl accepts the three domain shapes', () => {
  assert.equal(teamUrl('cmes'), 'https://cmes.cloudflareaccess.com');
  assert.equal(teamUrl('cmes.cloudflareaccess.com'), 'https://cmes.cloudflareaccess.com');
  assert.equal(teamUrl('https://cmes.cloudflareaccess.com/'), 'https://cmes.cloudflareaccess.com');
});

test('check accepts a valid Access JWT', async (t) => {
  withCerts(t);
  assert.equal(await check(request(sign(claims())), env), '');
});

test('check rejects a bad signature', async (t) => {
  withCerts(t);
  const jwt = sign(claims());
  const dot = jwt.lastIndexOf('.');
  const i = dot + 8;
  const bad = jwt.slice(0, i) + (jwt[i] === 'A' ? 'B' : 'A') + jwt.slice(i + 1);
  assert.equal(await check(request(bad), env), 'bad-sig');
});

test('check rejects the wrong audience', async () => {
  assert.equal(await check(request(sign(claims({ aud: 'other' }))), env), 'bad-aud');
});

test('check rejects an expired token', async () => {
  assert.equal(await check(request(sign(claims({ exp: now - 10 }))), env), 'expired');
});

test('check reports a missing env var', async () => {
  assert.equal(await check(request('a.b.c'), {}), 'no-env:CF_ACCESS_TEAM_DOMAIN');
});
