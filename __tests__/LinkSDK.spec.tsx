import React, {createRef} from 'react';
import {it, describe, beforeEach, expect, jest} from '@jest/globals';
import renderer, {act, ReactTestRenderer} from 'react-test-renderer';
import {Linking} from 'react-native';

const mockInjectJavaScript = jest.fn();

jest.mock('react-native-url-polyfill', () => ({
  URL: global.URL,
  URLSearchParams: global.URLSearchParams,
}));

jest.mock('react-native-webview', () => {
  const {forwardRef, useImperativeHandle, createElement} =
    jest.requireActual<typeof import('react')>('react');
  const {View} =
    jest.requireActual<typeof import('react-native')>('react-native');
  const WebView = forwardRef((props: object, ref) => {
    useImperativeHandle(ref, () => ({injectJavaScript: mockInjectJavaScript}));
    return createElement(View, props);
  });
  return {WebView};
});

jest.mock('../src/components/LinkSDK/Logger', () => ({
  info: jest.fn(),
}));

import LinkSDK, {LinkSDKRef} from '../src/components/LinkSDK';
import UaePass from '../src/components/LinkSDK/UaePass';

const ACTIVATION_URL = 'https://idenfo.test/session/abc';
const REQUEST = `leanlink://uae_pass?url=${encodeURIComponent(ACTIVATION_URL)}`;
const COMPLETION = JSON.stringify({
  source: 'idenfo',
  event: 'uae-pass-sdk-complete',
  status: 'success',
  ref: 'ref-1',
});

describe('LinkSDK UAE PASS routing', () => {
  let tree: ReactTestRenderer;
  let callback: jest.Mock;

  const sdkWebView = () =>
    tree.root.find(node => typeof node.props.onOpenWindow === 'function');

  const sheetWebViews = () =>
    tree.root.findAll(
      node =>
        node.props.testID === 'uae-pass-webview' &&
        typeof node.props.onMessage === 'function',
    );

  const sheetUrl = () => sheetWebViews()[0]?.props.source.uri;

  const injectedStatus = () => {
    const calls = mockInjectJavaScript.mock.calls;
    const script = calls[calls.length - 1][0] as string;
    return JSON.parse(
      script.slice('window.postMessage('.length, script.indexOf(", '*')")),
    ).status;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockInjectJavaScript.mockReset();
    jest.spyOn(Linking, 'openURL').mockReset().mockResolvedValue(true);
    callback = jest.fn();
    const ref = createRef<LinkSDKRef>();
    act(() => {
      tree = renderer.create(
        <LinkSDK ref={ref} appToken="app-token" callback={callback} />,
      );
    });
    act(() => ref.current?.connect({customer_id: 'customer', permissions: []}));
  });

  it('opens the sheet from onShouldStartLoadWithRequest', () => {
    let result: boolean | undefined;
    act(() => {
      result = sdkWebView().props.onShouldStartLoadWithRequest({url: REQUEST});
    });
    expect(result).toBe(false);
    expect(sheetUrl()).toBe(ACTIVATION_URL);
    expect(Linking.openURL).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('opens the sheet from onOpenWindow', () => {
    act(() => {
      sdkWebView().props.onOpenWindow({nativeEvent: {targetUrl: REQUEST}});
    });
    expect(sheetUrl()).toBe(ACTIVATION_URL);
  });

  it('leaves UAE PASS requests in onNavigationStateChange alone', () => {
    act(() => {
      sdkWebView().props.onNavigationStateChange({url: REQUEST});
    });
    expect(sheetWebViews()).toHaveLength(0);
    expect(Linking.openURL).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('answers failed without a sheet for a bad link', () => {
    act(() => {
      sdkWebView().props.onShouldStartLoadWithRequest({
        url: 'leanlink://uae_pass?url=ftp%3A%2F%2Fx',
      });
    });
    expect(sheetWebViews()).toHaveLength(0);
    expect(injectedStatus()).toBe('failed');
  });

  it('ignores a second request while the sheet is open', () => {
    act(() => {
      sdkWebView().props.onOpenWindow({nativeEvent: {targetUrl: REQUEST}});
      sdkWebView().props.onShouldStartLoadWithRequest({
        url: `leanlink://uae_pass?url=${encodeURIComponent(
          'https://idenfo.test/other',
        )}`,
      });
    });
    expect(sheetUrl()).toBe(ACTIVATION_URL);
    expect(mockInjectJavaScript).not.toHaveBeenCalled();
  });

  it('injects the completion message into the SDK and closes the sheet', () => {
    act(() => {
      sdkWebView().props.onShouldStartLoadWithRequest({url: REQUEST});
    });
    act(() => {
      sheetWebViews()[0].props.onMessage({nativeEvent: {data: COMPLETION}});
    });
    expect(mockInjectJavaScript).toHaveBeenCalledWith(
      UaePass.buildInjection(COMPLETION),
    );
    expect(sheetWebViews()).toHaveLength(0);
  });

  it('accepts a new request after the sheet answered', () => {
    act(() => {
      sdkWebView().props.onShouldStartLoadWithRequest({url: REQUEST});
    });
    act(() => {
      sheetWebViews()[0].props.onMessage({nativeEvent: {data: COMPLETION}});
    });
    act(() => {
      sdkWebView().props.onShouldStartLoadWithRequest({url: REQUEST});
    });
    expect(sheetUrl()).toBe(ACTIVATION_URL);
  });

  it('closes the sheet when the SDK sends a regular callback', () => {
    act(() => {
      sdkWebView().props.onShouldStartLoadWithRequest({url: REQUEST});
    });
    act(() => {
      sdkWebView().props.onShouldStartLoadWithRequest({
        url: 'leanlink://cancelled?status=CANCELLED',
      });
    });
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({status: 'CANCELLED'}),
    );
    expect(sheetWebViews()).toHaveLength(0);
    expect(mockInjectJavaScript).not.toHaveBeenCalled();
  });
});
