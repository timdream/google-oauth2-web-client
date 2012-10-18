'use strict';

module('Immediate login integration');

test('login, get token, logout test', function () {
  var client_id = localhost_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id,
      scope: localhost_scope,
      redirect_uri: localhost_redirect_uri
    });
  equal(returnValue, true, 'init() returns true.');

  window.GO2.login(false, true);

  stop();

  var onlogin_token;
  window.GO2.onlogin = function (token) {
    window.GO2.onlogin = null;
    ok(!!token, 'Got token from onlogin: ' + token);
    onlogin_token = token;

    setTimeout(continueTest, 10);
  };

  function continueTest() {
    var token = window.GO2.getAccessToken();
    ok(!!token, 'GO2.getAccessToken() returns the token:' + token);

    equal(onlogin_token, token, 'Two tokens are identical.');

    window.GO2.onlogout = function () {
      window.GO2.onlogout = null;
      ok(true, 'GO2.logout() triggers onlogout callback');

      setTimeout(function () {

        var token = window.GO2.getAccessToken();
        ok(!token, 'GO2.getAccessToken() does not return the token');

        start();
      }, 10);
    };
    window.GO2.logout();
  };
});
