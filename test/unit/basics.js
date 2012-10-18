'use strict';

module('Basics');

test('GO2 object exists', function () {
  equal(typeof window.GO2, 'object', 'Passed!');
});

test('GO2.init function exists', function () {
  equal(typeof window.GO2.init, 'function', 'Passed!');
});

test('GO2.login function exists', function () {
  equal(typeof window.GO2.login, 'function', 'Passed!');
});

test('GO2.logout function exists', function () {
  equal(typeof window.GO2.logout, 'function', 'Passed!');
});

test('GO2.getAccessToken function exists', function () {
  equal(typeof window.GO2.getAccessToken, 'function', 'Passed!');
});
