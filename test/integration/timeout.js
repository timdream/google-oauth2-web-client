'use strict';

module('Immediate login integration - timeout test');

test('login, get token, timeout test', function () {
  var go2 = new GO2({
    clientId: LOCALHOST_CLIENT_ID,
    scope: LOCALHOST_SCOPE,
    redirectUri: LOCALHOST_REDIRECT_URI
  });
  equal(typeof go2, 'object', 'object returns.');

  go2.login(false, true);

  stop();

  var loginCallbackToken;
  var spy;
  go2.onlogin = function (token) {
    go2.onlogin = null;
    ok(!!token, 'Got token from onlogin: ' + token);
    loginCallbackToken = token;

    setTimeout(continueTest, 10);

    spy = sinon.spy(window, 'setTimeout');
  };

  function continueTest() {
    var token = go2.getAccessToken();
    ok(!!token, 'go2.getAccessToken() returns the token:' + token);

    equal(loginCallbackToken, token, 'Two tokens are identical.');

    go2.onlogout = function () {
      go2.onlogout = null;
      ok(true, 'timeout triggers onlogout callback');

      spy.restore();

      setTimeout(function () {
        var token = go2.getAccessToken();
        ok(!token, 'go2.getAccessToken() does not return the token');

        go2.destory();
        start();
      }, 10);
    };

    equal(spy.callCount, 1, 'setTimeout is being called once.');

    var fn = spy.firstCall.args[0];
    equal(typeof fn, 'function', 'setTimeout is passed with a function');
    var time = spy.firstCall.args[1];
    equal(typeof time, 'number', 'setTimeout is passed with a time: ' + time);

    // remove the original timeout
    clearTimeout(spy.returnValues[0]);
    // trigger timeout
    fn.call(window);
  };
});
