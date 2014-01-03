'use strict';

module('Basics');

test('GO2 function exists', function () {
  equal(typeof window.GO2, 'function', 'Passed!');
});

test('GO2.prototype.login function exists', function () {
  equal(typeof window.GO2.prototype.login, 'function', 'Passed!');
});

test('GO2.prototype.logout function exists', function () {
  equal(typeof window.GO2.prototype.logout, 'function', 'Passed!');
});

test('GO2.prototype.getAccessToken function exists', function () {
  equal(typeof window.GO2.prototype.getAccessToken, 'function', 'Passed!');
});

test('GO2.prototype.destory function exists', function () {
  equal(typeof window.GO2.prototype.destory, 'function', 'Passed!');
});
