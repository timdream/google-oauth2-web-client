/* Simple Google API OAuth 2.0 Client flow library

  Author: timdream

  Usage:
  GO2.init(options)
    Initialize the library. options is an object with the following properties:
    - client_id (required)
    - redirect_uri (optional, default to the current page)
      To use the current page as the redirect_uri,
      put this script before Analytics so that the second load won't result
      a page view register.
    - scope (optional, default to 'https://www.googleapis.com/auth/plus.me')
      A string or array indicates the Google API access your application is
      requesting.
  GO2.getToken(callback)
    Send access token to the callback function as the first argument.
    If not logged in this triggers login popup and execute login after
    logged in.
    Be sure to call this function in user-triggered event (such as click) to
    prevent popup blocker.
    If not sure do use isLoggedIn() below to check first.
  GO2.isLoggedIn()
    boolean

*/

'use strict';

(function(w) {

  var windowName = 'google_oauth2_login_popup';

  // If the script loads in a popup matches the windowName,
  // we need to handle the request instead.
  if (w.name === windowName) {
    if (w.opener && w.opener.GO2) {
      if (w.location.hash.indexOf('access_token') !== -1) {
        w.opener.GO2.receiveToken(
          w.location.hash.replace(/^.*access_token=([^&]+).*$/, '$1'),
          parseInt(w.location.hash.replace(/^.*expires_in=([^&]+).*$/, '$1')),
          w.location.hash.replace(/^.*state=go2_([^&]+).*$/, '$1')
        );
      }
      if (w.location.search.indexOf('error=')) {
        w.opener.GO2.receiveToken(false);
      }
    }

    w.close();

    return;
  }

  var client_id,
  scope = 'https://www.googleapis.com/auth/plus.me',
  redirect_uri = w.location.href.substr(0,
                                        w.location.href.length -
                                        w.location.hash.length)
                                .replace(/#$/, ''),
  access_token,
  callbacks = {};

  var GO2 = {
    // init
    init: function(options) {
      if (!options.client_id)
        return false;

      // Save the client id;
      client_id = options.client_id;

      // rewrite scope
      if (options.scope)
        scope = options.scope;

      // if scope is an array, convert it into a string.
      if (scope.constructor === Array)
        scope = scope.join(' ');

      // rewrite redirect_uri
      if (options.redirect_uri)
        redirect_uri = options.redirect_uri;

      return true;
    },
    // receive token from popup
    receiveToken: function(token, expires_in, callback_id) {
      var callback = callbacks[callback_id];
      if (!callback)
        return;

      delete callbacks[callback_id];

      if (!token) {
        callback();
        return;
      }

      access_token = token;
      callback(access_token);

      setTimeout(
        function removeToken() {
          access_token = undefined;
        },
        expires_in * 1000
      );
    },
    // boolean, indicate logged in or not
    isLoggedIn: function() {
      return !!access_token;
    },
    // pass the access token to callback
    // if not logged in this triggers login popup;
    // use isLoggedIn to check login first to prevent popup blocker
    getToken: function(callback) {
      if (!client_id || !redirect_uri || !scope) {
        alert('You need init() first. Check the program flow.');
        return false;
      }

      if (access_token) {
        return callback(access_token);
      }

      var callback_id = Math.random().toString(32).substr(2);

      callbacks[callback_id] = callback;
      w.open(
        'https://accounts.google.com/o/oauth2/auth' +
        '?response_type=token' +
        '&redirect_uri=' + encodeURIComponent(redirect_uri) +
        '&scope=' + encodeURIComponent(scope) +
        '&state=go2_' + callback_id +
        '&client_id=' + encodeURIComponent(client_id),
        windowName,
        'width=400,height=360'
      );
    }
  };

  // Expose the library as an AMD module
  if (typeof define === 'function' && define.amd) {
    define('google-oauth2-web-client', [], function() { return GO2; });
  } else {
    w.GO2 = GO2;
  }

})(this);
