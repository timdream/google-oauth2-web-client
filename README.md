# google-oauth2-web-client

Login with Google using OAuth2 for client-side web app, completes login flow discribed in [Using OAuth 2.0 for Client-side Applications](https://developers.google.com/accounts/docs/OAuth2UserAgent).

This library is a spin-off project from [HTML5 Word Cloud](https://github.com/timdream/wordcloud). The original commits can be found in [here](https://github.com/timdream/wordcloud/commits/master/go2.js).

## FAQ

### Why not use [library supplied by Google](https://code.google.com/p/google-api-javascript-client/wiki/Authentication) and reinvent the wheel?

Because I can; also because the library is light-weighted and transparent to me.

You are very welcome to use the library from Google since it will be better supported.

### What can I do with the `access_token` I got once the login is completed?

You can

- Use the token to request data from Google's server directly from the client-side web app in the browser, for example, [this is how HTML Word Cloud does it](https://github.com/timdream/wordcloud/blob/master/jquery.getcontent.js#L124).
- Send the token to your own server, verify it with Google to associate a Google account with a user session on your site. [Documentation here](https://developers.google.com/accounts/docs/OAuth2Login#validatingtoken).