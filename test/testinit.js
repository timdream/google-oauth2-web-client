'use strict';

var localhost_client_id = '519733320959.apps.googleusercontent.com';
var localhost_scope = ['https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'];
var localhost_redirect_uri = 'http://127-0-0-1.org.uk:8009/test/';

// The fake one allows Google to show an error page without log us in automatically
var fake_client_id = 'not-valid.apps.googleusercontent.com';

var apiUrl = 'https://accounts.google.com/o/oauth2/auth';
var defaultScope = 'https://www.googleapis.com/auth/plus.me';

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

  equal(window.location.href.substr(0, localhost_redirect_uri.length), localhost_redirect_uri,
        'Integration will work; test is running on presumed URL.');
});
