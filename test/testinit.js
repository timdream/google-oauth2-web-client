'use strict';

var LOCALHOST_CLIENT_ID = '519733320959.apps.googleusercontent.com';
var LOCALHOST_SCOPE = ['https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'];
var LOCALHOST_REDIRECT_URI = 'http://127-0-0-1.org.uk:8009/test/';

// The fake one allows Google to show an error page without log us in automatically
var FAKE_CLIENT_ID = 'not-valid.apps.googleusercontent.com';

var API_URL = 'https://accounts.google.com/o/oauth2/auth';
var DEFAULT_SCOPE = 'https://www.googleapis.com/auth/plus.me';

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
  if (win && win.close)
    win.close();

  equal(window.location.href.substr(0, LOCALHOST_REDIRECT_URI.length), LOCALHOST_REDIRECT_URI,
        'Integration will work; test is running on presumed URL.');
});
