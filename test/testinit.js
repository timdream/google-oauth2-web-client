'use strict';

var LOCALHOST_CLIENT_ID = '519733320959.apps.googleusercontent.com';
var LOCALHOST_SCOPE = ['https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'];
var LOCALHOST_REDIRECT_URI = 'http://127-0-0-1.org.uk:8009/test/';

// The fake one allows Google to show an error page without log us in
// automatically in the initiation tests.
var FAKE_CLIENT_ID = 'not-valid.apps.googleusercontent.com';

// Fake local OAuth file to simulate successful login
var FAKE_LOCAL_API_URL = './fake-oauth-success.html';

var DEFAULT_SCOPE = 'https://www.googleapis.com/auth/plus.me';

var API_URL = 'https://accounts.google.com/o/oauth2/auth';

var LOCALTEST = false;

// If we are asked to run local tests, replace API_URL and OAUTH_URL
// to the full URL resolved from FAKE_LOCAL_API_URL.
if (window.location.search.indexOf('localtest=true') !== -1) {
  GO2.prototype.OAUTH_URL = API_URL = (function() {
    var urlUtil;
    if (typeof window.URL === 'function') {
      urlUtil = new window.URL(FAKE_LOCAL_API_URL, window.location);
    } else {
      urlUtil = document.createElement('a');
    }

    return urlUtil.href;
  })();

  LOCALHOST_REDIRECT_URI = window.location.href;

  LOCALTEST = true;
}

function splitUrlArgs(urlArgs) {
  var urlArgKeys = [];
  var urlArgValues = [];

  urlArgs.split('&').forEach(function (keyValue) {
    var kv = keyValue.split('=');
    urlArgKeys.push(kv.shift());
    urlArgValues.push(decodeURIComponent(kv.join('')));
  });

  return {
    keys: urlArgKeys,
    values: urlArgValues
  };
}

test('Testing environment test', function () {
  var win = window.open('');
  equal(typeof win, 'object', 'Popup blocker is not in-effect');
  if (win && win.close) {
    win.close();
  }

  if (window.location.href.substr(0, LOCALHOST_REDIRECT_URI.length) ===
      LOCALHOST_REDIRECT_URI) {
    ok(true,
          'Remote test connecting Google work; ' +
          'test is running on presumed URL.');
  } else if (LOCALTEST) {
    ok(true, 'Fake local OAuth URL is enabled.');
  } else {
    ok(false, 'Tests will fail unless you use the presumed test URL to reach ' +
      'this page, or specify localtest=true explicitly');
  }
});
