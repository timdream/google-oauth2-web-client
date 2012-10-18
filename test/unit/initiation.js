'use strict';

module('GO2.init()');

test('GO2.init() without options object should return false', function () {
  var returnValue = window.GO2.init();
  equal(returnValue, false, 'Passed!');
});

test('GO2.init() without client_id should return false', function () {
  var returnValue = window.GO2.init({});
  equal(returnValue, false, 'Passed!');
});

test('GO2.init() with client_id should return true', function () {
  var returnValue = window.GO2.init(
    { client_id: fake_client_id });
  equal(returnValue, true, 'Passed!');
});

module('GO2.login() immediate login initiation');

if (!window.location.hash)
  window.location.hash = '#url-with-hash';

test('GO2.login(false, true) should launch an iframe with correct url', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init(
    { client_id: client_id });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  window.GO2.login(false, true);

  ok(spy.called, 'createElement is called.');
  equal(spy.callCount, 1, 'createElement is called once.');
  equal(spy.firstCall.args[0], 'iframe', 'createElement is asked to create iframe element.');

  var frame = spy.returnValues[0];
  equal(frame.constructor, HTMLIFrameElement, 'return value is an iframe.');
  equal(frame.parentNode, document.body, 'iframe is appended to body.');

  var url = frame.src;
  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));

  ok(urlArgs.keys.indexOf('client_id') !== -1, 'client_id exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('client_id')], client_id,
    'client id is the specified client id.');

  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], defaultScope,
    'scope is the default scope.');

  ok(urlArgs.keys.indexOf('redirect_uri') !== -1, 'redirect_uri exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('redirect_uri')].indexOf('#'), -1,
    'redirect_uri does not contain hash.');

  if (window.location.hash === '#url-with-hash')
    window.location.hash = '';

  spy.restore();
});

test('The second GO2.login(false, true) should remove the first frame', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init(
    { client_id: client_id });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  window.GO2.login(false, true);
  window.GO2.login(false, true);

  equal(spy.callCount, 2, 'createElement is called twice');

  var frame0 = spy.returnValues[0];
  var frame1 = spy.returnValues[1];

  notEqual(frame0.parentNode, document.body, 'first iframe is not appended to body.');
  equal(frame1.parentNode, document.body, 'second iframe is appended to body.');

  spy.restore();
});

test('scope should be able to assigned to iframe', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id,
      scope: 'fake-scope'
    });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  window.GO2.login(false, true);

  var frame = spy.returnValues[0];
  var url = frame.src;
  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));

  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], 'fake-scope',
    'scope is the specified scope.');

  spy.restore();
});

test('scope as an array should be able to assigned to iframe', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id,
      scope: ['fake-scope', 'fake-scope2']
    });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  window.GO2.login(false, true);

  var frame = spy.returnValues[0];
  var url = frame.src;
  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));

  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], 'fake-scope fake-scope2',
    'scope is the specified scope.');

  spy.restore();
});

test('redirect_uri should be able to assigned to iframe', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id,
      redirect_uri: 'fake-redirect_uri'
    });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  window.GO2.login(false, true);

  var frame = spy.returnValues[0];
  var url = frame.src;
  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));

  ok(urlArgs.keys.indexOf('redirect_uri') !== -1, 'redirect_uri exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('redirect_uri')], 'fake-redirect_uri',
    'redirect_uri is the specified redirect_uri.');

  spy.restore();
});

test('approval_prompt should be able to set to auto on iframe', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id
    });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the document.createElement method so we can inspect the calls.
  var spy = sinon.spy(document, 'createElement');

  window.GO2.login(true, true);

  var frame = spy.returnValues[0];
  var url = frame.src;
  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));
  ok(urlArgs.keys.indexOf('approval_prompt') !== -1, 'approval_prompt exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('approval_prompt')], 'auto',
    'approval_prompt is the specified to auto.');

  spy.restore();
});

module('GO2.login() interactive login initiation');

test('GO2.login() should launch an popup with correct url', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id,
      scope: 'fake-scope'
    });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  window.GO2.login();

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];
  var popupWindow = spy.returnValues[0];

  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  equal(typeof popupWindow, 'object', 'window reference is returned.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));

  ok(urlArgs.keys.indexOf('client_id') !== -1, 'client_id exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('client_id')], client_id,
    'client id is the specified client id.');

  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], 'fake-scope',
    'scope is the specified scope.');

  ok(urlArgs.keys.indexOf('redirect_uri') !== -1, 'redirect_uri exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('redirect_uri')].indexOf('#'), -1,
    'redirect_uri does not contain hash.');

  if (popupWindow && popupWindow.close)
    popupWindow.close();

  spy.restore();
});

test('scope should be able to assigned to login popup', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id,
      scope: 'fake-scope'
    });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  window.GO2.login();

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];
  var popupWindow = spy.returnValues[0];

  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));
  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], 'fake-scope',
    'scope is the specified scope.');

  if (popupWindow && popupWindow.close)
    popupWindow.close();

  spy.restore();
});

test('scope as an array should be able to assigned to login popup', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id,
      scope: ['fake-scope', 'fake-scope2']
    });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  window.GO2.login();

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];
  var popupWindow = spy.returnValues[0];

  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));
  ok(urlArgs.keys.indexOf('scope') !== -1, 'scope exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('scope')], 'fake-scope fake-scope2',
    'scope is the specified scope.');

  if (popupWindow && popupWindow.close)
    popupWindow.close();

  spy.restore();
});

test('redirect_uri should be able to assigned to login popup', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id,
      redirect_uri: 'fake-redirect_uri'
    });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  window.GO2.login();

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];
  var popupWindow = spy.returnValues[0];

  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));
  ok(urlArgs.keys.indexOf('redirect_uri') !== -1, 'redirect_uri exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('redirect_uri')], 'fake-redirect_uri',
    'redirect_uri is the specified redirect_uri.');

  if (popupWindow && popupWindow.close)
    popupWindow.close();

  spy.restore();
});

test('approval_prompt should be set non-exist to login popup by default', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id
    });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  window.GO2.login();

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];
  var popupWindow = spy.returnValues[0];

  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));
  ok(urlArgs.keys.indexOf('approval_prompt') === -1, 'approval_prompt does not exists');

  if (popupWindow && popupWindow.close)
    popupWindow.close();

  spy.restore();
});

test('approval_prompt should be able to set to force to login popup', function () {
  var client_id = fake_client_id;

  var returnValue = window.GO2.init({
      client_id: client_id
    });
  equal(returnValue, true, 'init() returns true.');

  // Wrap the window.open method so we can inspect the calls.
  var spy = sinon.spy(window, 'open');

  window.GO2.login(true);

  equal(spy.callCount, 1, 'window.open is called once.');

  var url = spy.firstCall.args[0];
  var popupWindow = spy.returnValues[0];

  equal(url.substr(0, apiUrl.length + 1), apiUrl + '?',
    'src is pointing to the correct api endpoint.');

  var urlArgs = splitUrlArgs(url.substr(apiUrl.length + 1));
  ok(urlArgs.keys.indexOf('approval_prompt') !== -1, 'approval_prompt exists');
  equal(urlArgs.values[urlArgs.keys.indexOf('approval_prompt')], 'force',
    'approval_prompt is the specified to force.');

  if (popupWindow && popupWindow.close)
    popupWindow.close();

  spy.restore();
});
