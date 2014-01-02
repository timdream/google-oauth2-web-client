# google-oauth2-web-client

Login with Google using OAuth2 for client-side web app, completes login flow discribed in [Using OAuth 2.0 for Client-side Applications](https://developers.google.com/accounts/docs/OAuth2UserAgent).

This library is a spin-off project from [HTML5 Word Cloud](https://github.com/timdream/wordcloud). The original commits can be found in [here](https://github.com/timdream/wordcloud/commits/master/go2.js).

## Simple usage

1. Load the script with `<script>` or as an AMD module.
2. Initialize the library with `GO2.init(options)`, where options should contain at least the `client_id` you got from the Google [API Console](https://code.google.com/apis/console#access).
3. Attach your callbacks to `GO2.onlogin` and `GO2.onlogout`.
You will be able to get the `access_token` from `onlogin` callback or from the `GO2.getAccessToken()` method.
4. (Immediate mode) At this point, you may call `GO2.login(false, true)` and to silently test and regain the previous approvial.
If it's approved, `onlogin` callback will fire.
5. Call `GO2.login()` to start an interactive login process, with a popup.
The call must be a result of a user action, such as a click, to prevent popup blocker.

Check out comments in the script source code for detail.

## FAQ

### Why not use [library supplied by Google](https://code.google.com/p/google-api-javascript-client/wiki/Authentication) and reinvent the wheel?

Because I can; also because the library is light-weighted and transparent to me.
For some reason, I cannot get `auth` library to load without getting the entire client library; onload callback never fires.

You are very welcome to use the library from Google since it will be better supported.

### What can I do with the `access_token` I got once the login is completed?

You can

- Use the token to request data from Google's server directly from the client-side web app in the browser (with JSON-P or CORS), for example, [this is how HTML5 Word Cloud does it](https://github.com/timdream/wordcloud/blob/3f358236/assets/fetchers.js#L263-L313).
- Send the token to your own server, verify it with Google to associate a Google account with a user session on your site. [Documentation here](https://developers.google.com/accounts/docs/OAuth2Login#validatingtoken).

## Testing

To run tests, first you would need to pull the required QUnit and Sinon.JS library by running

    git submodule init
    git submodule update

Then, start a localhost HTTP server, for example,

    python -m SimpleHTTPServer 8009

Point your browser to [http://127-0-0-1.org.uk:8009/test/](http://127-0-0-1.org.uk:8009/test/) to start testing. You will need to disable popup blocker to properly run the interactive testcases.

You will find all the information you need to write testcases on the [QUnit](http://qunitjs.com) and [Sinon.JS](http://sinonjs.org) website. All code submission are expected to accompany with testcases.
