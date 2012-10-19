'use strict';

module('Immediate login integration - timeout test');

test('login, get token, timeout test', function () {
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
  var spy;
  window.GO2.onlogin = function (token) {
    window.GO2.onlogin = null;
    ok(!!token, 'Got token from onlogin: ' + token);
    onlogin_token = token;

    setTimeout(continueTest, 10);

    spy = sinon.spy(window, 'setTimeout');
  };

  function continueTest() {
    var token = window.GO2.getAccessToken();
    ok(!!token, 'GO2.getAccessToken() returns the token:' + token);

    equal(onlogin_token, token, 'Two tokens are identical.');

    window.GO2.onlogout = function () {
      window.GO2.onlogout = null;
      ok(true, 'timeout triggers onlogout callback');

      spy.restore();

      setTimeout(function () {

        var token = window.GO2.getAccessToken();
        ok(!token, 'GO2.getAccessToken() does not return the token');

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
