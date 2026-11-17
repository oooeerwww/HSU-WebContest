import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveScreen, SCREENS } from '../js/lib/router.js';

test('known hash resolves to its screen', () => assert.equal(resolveScreen('#major'), 'major'));
test('empty hash resolves to home', () => assert.equal(resolveScreen(''), 'home'));
test('unknown hash resolves to home', () => assert.equal(resolveScreen('#nope'), 'home'));
test('screen list has home and 4 menus', () =>
  assert.deepEqual(SCREENS, ['home', 'myinfo', 'activities', 'major', 'extracurricular']));
