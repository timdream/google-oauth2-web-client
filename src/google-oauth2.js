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
    - popupWidth
    - popupHeight
  GO2.login(approval_prompt, immediate): Log in.
    Set immediate to true to attempt to login with a invisible frame.
    Set approval_prompt to true to force the popup prompt.
  GO2.logout(): Log out.
  GO2.getAccessToken(): return the token.
  GO2.onlogin: callback(access_token)
  GO2.onlogout: callback()
*/

'use strict';

(function(w) {

  var windowName = 'google_oauth2_login_popup';

  // If the script loads in a popup matches the windowName,
  // we need to handle the request instead.
  if (w.name === windowName) {
    var GO2;
    if (w.opener && w.opener.GO2)
      GO2 = w.opener.GO2;
    if (w.parent && w.parent.GO2)
      GO2 = w.parent.GO2;

    if (GO2 && w.location.hash.indexOf('access_token') !== -1) {
      GO2._handleMessage(
        w.location.hash.replace(/^.*access_token=([^&]+).*$/, '$1'),
        parseInt(w.location.hash.replace(/^.*expires_in=([^&]+).*$/, '$1')),
        w.location.hash.replace(/^.*state=go2_([^&]+).*$/, '$1')
      );
    }
    if (GO2 && w.location.search.indexOf('error=')) {
      GO2._handleMessage(false);
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
  timer,
  immediate_frame,
  state_id = Math.random().toString(32).substr(2),
  popupWidth = 500,
  popupHeight = 400;

  var GO2 = {
    // init
    init: function go2_init(options) {
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

      // popup dimensions
      popupHeight = options.popupHeight || popupHeight;
      popupWidth = options.popupWidth || popupWidth;

      return true;
    },
    login: function go2_login(force_approval_prompt, immediate) {
      if (access_token)
        return;

      // Remove pending immediate_frame
      GO2._removeImmediateFrame();

      var url = 'https://accounts.google.com/o/oauth2/auth' +
        '?response_type=token' +
        '&redirect_uri=' + encodeURIComponent(redirect_uri) +
        '&scope=' + encodeURIComponent(scope) +
        '&state=go2_' + state_id +
        '&client_id=' + encodeURIComponent(client_id);

      if (!immediate && force_approval_prompt) {
        url += '&approval_prompt=force';
      }

      if (immediate) {
        url += '&approval_prompt=auto';

        // Open up an iframe to login
        // We might not be able to hear any of the callback
        // because of X-Frame-Options.
        immediate_frame = document.createElement('iframe');
        immediate_frame.src = url;
        immediate_frame.hidden = true;
        immediate_frame.width = immediate_frame.height = 1;
        immediate_frame.name = windowName;
        document.body.appendChild(immediate_frame);

        return;
      }

      // Open the popup
      var left = window.screenX + (window.outerWidth / 2) - (popupWidth / 2);
      var top = window.screenY + (window.outerHeight / 2) - (popupHeight / 2);
      w.open(url, windowName, 'width=' + popupWidth +
                              ',height=' + popupHeight +
                              ',top=' + top +
                              ',left=' + left +
                              ',location=yes,toolbar=no,menubar=no');
    },
    logout: function go2_logout() {
      if (!access_token)
        return;

      // Remove pending immediate_frame
      GO2._removeImmediateFrame();

      clearTimeout(timer);
      access_token = undefined;
      if (GO2.onlogout)
        GO2.onlogout();
    },
    getAccessToken: function go2_getAccessToken() {
      return access_token;
    },
    // receive token from popup / frame
    _handleMessage: function go2_handleMessage(token, expires_in, s_id) {
      if (state_id !== s_id)
        return;

      // Remove pending immediate_frame
      GO2._removeImmediateFrame();

      // Do nothing if there is no token received.
      if (!token)
        return;

      access_token = token;

      if (GO2.onlogin)
        GO2.onlogin(access_token);

      // Remove the token if timed out.
      clearTimeout(timer);
      timer = setTimeout(
        function tokenTimeout() {
          access_token = undefined;
          if (GO2.onlogout)
            GO2.onlogout();
        },
        expires_in * 1000
      );
    },
    // Remove pending immediate_frame
    _removeImmediateFrame: function go2_removeImmediateFrame() {
      if (!immediate_frame)
        return;

      document.body.removeChild(immediate_frame);
      immediate_frame = null;
    }
  };

  // Expose the library as an AMD module
  if (typeof define === 'function' && define.amd) {
    define('google-oauth2-web-client', [], function() { return GO2; });
  } else {
    w.GO2 = GO2;
  }

})(this);
