'use strict';

module('Immediate login integration');

test('successful login should trigger onlogin callback', function () {
  var client_id = localhost_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id,
      scope: localhost_scope,
      redirect_uri: localhost_redirect_uri
    });
  equal(returnValue, true, 'init() returns true.');

  window.GO2.login(false, true);

  stop();

  window.GO2.onlogin = function (token) {
    window.GO2.onlogin = null;
    ok(!!token, 'Got token from onlogin: ' + token);

    start();
  };
});

test('when logged in, GO2.getAccessToken() should return the token', function () {
  var token = window.GO2.getAccessToken();
  ok(!!token, 'Pass with token:' + token);
});

test('GO2.logout() should trigger onlogout callback', function () {
  stop();

  window.GO2.onlogout = function () {
    window.GO2.onlogout = null;
    ok(true, 'Passed!');

    start();
  };
  window.GO2.logout();
});

test('when logged out, GO2.getAccessToken() should not return the token', function () {
  var token = window.GO2.getAccessToken();
  ok(!token, 'Not getting token.');
});
