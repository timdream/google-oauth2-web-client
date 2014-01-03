'use strict';

module('new GO2()');

test('new GO2() without options object should throw', function () {
  try {
    var go2 = new GO2();
  } catch (e) {
    ok(true, 'Passed!');
  }
});

test('new GO2() without clientId should throw', function () {
  try {
    var go2 = new GO2({});
  } catch (e) {
    ok(true, 'Passed!');
  }
});

test('new GO2() with clientId should pass', function () {
  var go2 = new GO2({ clientId: FAKE_CLIENT_ID });
  equal(typeof go2, 'object', 'Passed!');
  go2.destory();
});

module('go2.destory()');

test('go2.destory() should clean up all references.', function () {
  var go2 = new GO2({ clientId: FAKE_CLIENT_ID });
  equal(typeof go2, 'object', 'Passed!');

  // Wrap the window.open method so we can inspect the calls.
  var openSpy = sinon.spy(window, 'open');

  // Wrap the document.createElement method so we can inspect the calls.
  var createElementSpy = sinon.spy(document, 'createElement');

  go2.login(false, true);
  go2.login();

  equal(openSpy.callCount, 1, 'window.open is called once.');
  equal(createElementSpy.callCount, 1, 'document.createElement is called once.');

  ok(window.__windowPendingGO2, 'pending ref exists.');

  var popupWindow = openSpy.returnValues[0];
  var frame = createElementSpy.returnValues[0];

  ok(!popupWindow.closed, 'popup is not closed.');

  go2.destory();

  notEqual(frame.parentNode, document.body, 'iframe is not appended to body.');
  ok(popupWindow.closed, 'popup is closed.');
  ok(!window.__windowPendingGO2, 'pending ref is removed.');

  openSpy.restore();
  createElementSpy.restore();
});

module('go2.login() immediate login initiation');

test('go2.login(false, true) should launch an iframe with correct url', function () {
  if (!window.location.hash)
    window.location.hash = '#url-with-hash';

  var go2 = new GO2({ clientId: FAKE_CLIENT_ID });

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  go2.login(false, true);

  ok(spy.called, 'createElement is called.');
  equal(spy.callCount, 1, 'createElement is called once.');
  equal(spy.firstCall.args[0], 'iframe', 'createElement is asked to create iframe element.');

  var frame = spy.returnValues[0];
  equal(frame.constructor, HTMLIFrameElement, 'return value is an iframe.');
  equal(frame.parentNode, document.body, 'iframe is appended to body.');

  var url = frame.src;
  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));

  ok(urlArgs.keys.indexOf('client_id') !== -1, 'client_id exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('client_id')], FAKE_CLIENT_ID,
    'client id is the specified client id.');

  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], DEFAULT_SCOPE,
    'scope is the default scope.');

  ok(urlArgs.keys.indexOf('redirect_uri') !== -1, 'redirect_uri exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('redirect_uri')].indexOf('#'), -1,
    'redirect_uri does not contain hash.');

  if (window.location.hash === '#url-with-hash')
    window.location.hash = '';

  spy.restore();
  go2.destory();
});

test('The second go2.login(false, true) should remove the first frame', function () {
  var go2 = new GO2({ clientId: FAKE_CLIENT_ID });

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  go2.login(false, true);
  go2.login(false, true);

  equal(spy.callCount, 2, 'createElement is called twice');

  var frame0 = spy.returnValues[0];
  var frame1 = spy.returnValues[1];

  notEqual(frame0.parentNode, document.body, 'first iframe is not appended to body.');
  equal(frame1.parentNode, document.body, 'second iframe is appended to body.');

  spy.restore();
  go2.destory();
});

test('scope should be able to assigned to iframe', function () {
  var go2 = new GO2({
    clientId: FAKE_CLIENT_ID,
    scope: 'fake-scope' });

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  go2.login(false, true);

  var frame = spy.returnValues[0];
  var url = frame.src;
  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));

  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], 'fake-scope',
    'scope is the specified scope.');

  spy.restore();
  go2.destory();
});

test('scope as an array should be able to assigned to iframe', function () {
  var go2 = new GO2({
    clientId: FAKE_CLIENT_ID,
    scope: ['fake-scope', 'fake-scope2'] });

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  go2.login(false, true);

  var frame = spy.returnValues[0];
  var url = frame.src;
  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));

  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], 'fake-scope fake-scope2',
    'scope is the specified scope.');

  spy.restore();
  go2.destory();
});

test('redirectUri should be able to assigned to iframe', function () {
  var go2 = new GO2({
    clientId: FAKE_CLIENT_ID,
    redirectUri: 'fake-redirect-uri' });

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  go2.login(false, true);

  var frame = spy.returnValues[0];
  var url = frame.src;
  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));

  ok(urlArgs.keys.indexOf('redirect_uri') !== -1, 'redirect_uri exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('redirect_uri')], 'fake-redirect-uri',
    'redirectUri is the specified redirectUri.');

  spy.restore();
  go2.destory();
});

test('approval_prompt should be able to set to auto on iframe', function () {
  var go2 = new GO2({ clientId: FAKE_CLIENT_ID });

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  go2.login(true, true);

  var frame = spy.returnValues[0];
  var url = frame.src;
  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));
  ok(urlArgs.keys.indexOf('approval_prompt') !== -1, 'approval_prompt exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('approval_prompt')], 'auto',
    'approval_prompt is the specified to auto.');

  spy.restore();
  go2.destory();
});

module('go2.login() interactive login initiation');

test('go2.login() should launch an popup with correct url', function () {
  var go2 = new GO2({
    clientId: FAKE_CLIENT_ID });

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  go2.login();

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];

  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));

  ok(urlArgs.keys.indexOf('client_id') !== -1, 'client_id exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('client_id')], FAKE_CLIENT_ID,
    'client id is the specified client id.');

  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], DEFAULT_SCOPE,
    'scope is the default scope.');

  ok(urlArgs.keys.indexOf('redirect_uri') !== -1, 'redirect_uri exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('redirect_uri')].indexOf('#'), -1,
    'redirect_uri does not contain hash.');

  spy.restore();
  go2.destory();
});

test('scope should be able to assigned to login popup', function () {
  var go2 = new GO2({
    clientId: FAKE_CLIENT_ID,
    scope: 'fake-scope' });

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  go2.login();

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];

  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));
  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], 'fake-scope',
    'scope is the specified scope.');

  spy.restore();
  go2.destory();
});

test('scope as an array should be able to assigned to login popup', function () {
  var go2 = new GO2({
    clientId: FAKE_CLIENT_ID,
    scope: ['fake-scope', 'fake-scope2'] });

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  go2.login();

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];

  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));
  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], 'fake-scope fake-scope2',
    'scope is the specified scope.');

  spy.restore();
  go2.destory();
});

test('redirect_uri should be able to assigned to login popup', function () {
  var go2 = new GO2({
    clientId: FAKE_CLIENT_ID,
    redirectUri: 'fake-redirect-uri' });

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  go2.login();

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];

  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));

  ok(urlArgs.keys.indexOf('redirect_uri') !== -1, 'redirect_uri exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('redirect_uri')], 'fake-redirect-uri',
    'redirectUri is the specified redirectUri.');

  spy.restore();
  go2.destory();
});

test('approval_prompt should be set non-exist to login popup by default', function () {
  var go2 = new GO2({ clientId: FAKE_CLIENT_ID });

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  go2.login();

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];

  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));
  ok(urlArgs.keys.indexOf('approval_prompt') === -1, 'approval_prompt does not exists');

  spy.restore();
  go2.destory();
});

test('approval_prompt should be able to set to force to login popup', function () {
  var go2 = new GO2({ clientId: FAKE_CLIENT_ID });

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  go2.login(true);

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];

  equal(url.substr(0, API_URL.length + 1), API_URL + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(API_URL.length + 1));
  ok(urlArgs.keys.indexOf('approval_prompt') !== -1, 'approval_prompt exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('approval_prompt')], 'force',
    'approval_prompt is the specified to force.');

  spy.restore();
  go2.destory();
});
