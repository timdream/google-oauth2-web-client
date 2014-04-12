'use strict';

module('Interactive login integration');

test('login, get token, logout test', function () {
  var go2 = new GO2({
    clientId: LOCALHOST_CLIENT_ID,
    scope: LOCALHOST_SCOPE,
    redirectUri: LOCALHOST_REDIRECT_URI
  });
  equal(typeof go2, 'object', 'object returns.');

  go2.login();

  stop();

  var loginCallbackToken;
  go2.onlogin = function (token) {
    go2.onlogin = null;
    if (LOCALTEST) {
      equal(token, 'FAKE_ACCESS_TOKEN_FROM_FAKE_OAUTH',
        'Got token from fake oauth');
    } else {
      ok(!!token, 'Got token from Google: ' + token);
    }
    loginCallbackToken = token;

    setTimeout(continueTest, 10);
  };

  function continueTest() {
    var token = go2.getAccessToken();
    ok(!!token, 'go2.getAccessToken() returns the token:' + token);

    equal(loginCallbackToken, token, 'Two tokens are identical.');

    go2.onlogout = function () {
      go2.onlogout = null;
      ok(true, 'go2.logout() triggers onlogout callback');

      setTimeout(function () {
        var token = go2.getAccessToken();
        ok(!token, 'go2.getAccessToken() does not return the token');

        go2.destory();
        start();
      }, 10);
    };
    go2.logout();
  };
});
