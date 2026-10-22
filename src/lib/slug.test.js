import assert from 'node:assert/strict';
import { test } from 'node:test';
import { slugify, withSlash } from './slug.js';

test('slugify lowercases, strips accents, and joins words', () => {
  assert.equal(slugify('Curses per muntanya'), 'curses-per-muntanya');
  assert.equal(slugify('Sóller'), 'soller');
  assert.equal(slugify('  --Hola!! '), 'hola');
});

test('withSlash keeps a leading and trailing slash', () => {
  assert.equal(withSlash('senderisme/foo'), '/senderisme/foo/');
  assert.equal(withSlash('/senderisme/foo/'), '/senderisme/foo/');
});
