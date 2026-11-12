import React from 'react';
import {it, describe, beforeEach, afterEach, expect, jest} from '@jest/globals';
import renderer, {act, ReactTestRenderer} from 'react-test-renderer';
import {Linking, Modal, Platform} from 'react-native';

const mockInjectJavaScript = jest.fn();

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

import UaePassSheet from '../src/components/LinkSDK/UaePassSheet';

const URL = 'https://idenfo.test/session/abc';
const COMPLETION = JSON.stringify({
  source: 'idenfo',
  event: 'uae-pass-sdk-complete',
  status: 'success',
  ref: 'ref-1',
  uaePassData: {idn: '784-1990-1234567-1'},
});

describe('UaePassSheet', () => {
  let onComplete: jest.Mock<(message: string) => void>;
  let tree: ReactTestRenderer;

  const render = (url: string | null) => {
    act(() => {
      tree = renderer.create(
        <UaePassSheet url={url} onComplete={onComplete} />,
      );
    });
  };

  const webView = () => tree.root.findByProps({testID: 'uae-pass-webview'});

  const lastStatus = () =>
    JSON.parse(onComplete.mock.calls[onComplete.mock.calls.length - 1][0])
      .status;

  const flush = () => act(() => Promise.resolve());

  beforeEach(() => {
    onComplete = jest.fn();
    mockInjectJavaScript.mockReset();
    jest.spyOn(Linking, 'openURL').mockReset().mockResolvedValue(true);
  });

  it('stays closed without a link', () => {
    render(null);
    expect(tree.root.findByType(Modal).props.visible).toBe(false);
    expect(tree.root.findAllByProps({testID: 'uae-pass-webview'})).toHaveLength(
      0,
    );
  });

  it('opens the link in a WebView', () => {
    render(URL);
    expect(tree.root.findByType(Modal).props.visible).toBe(true);
    expect(webView().props.source).toEqual({uri: URL});
  });

  it('forwards the Idenfo completion message', () => {
    render(URL);
    act(() => webView().props.onMessage({nativeEvent: {data: COMPLETION}}));
    expect(onComplete).toHaveBeenCalledWith(COMPLETION);
  });

  it('ignores other messages', () => {
    render(URL);
    act(() => {
      webView().props.onMessage({nativeEvent: {data: 'hello'}});
      webView().props.onMessage({
        nativeEvent: {data: JSON.stringify({source: 'other'})},
      });
    });
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('answers cancelled when closed', () => {
    render(URL);
    act(() =>
      tree.root.findByProps({testID: 'uae-pass-close'}).props.onPress(),
    );
    expect(lastStatus()).toBe('cancelled');
  });

  it('answers cancelled on Android back', () => {
    render(URL);
    act(() => tree.root.findByType(Modal).props.onRequestClose());
    expect(lastStatus()).toBe('cancelled');
  });

  it('answers failed when the link cannot be opened', () => {
    render(URL);
    act(() =>
      webView().props.onError({nativeEvent: {code: -1004, canGoBack: false}}),
    );
    expect(lastStatus()).toBe('failed');
  });

  it('ignores errors later in the flow and benign iOS errors', () => {
    render(URL);
    act(() => {
      webView().props.onError({nativeEvent: {code: -999, canGoBack: false}});
      webView().props.onError({nativeEvent: {code: 102, canGoBack: false}});
      webView().props.onError({nativeEvent: {code: -6, canGoBack: true}});
    });
    expect(onComplete).not.toHaveBeenCalled();
  });

  describe('on Android', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });
    afterEach(() => {
      Platform.OS = 'ios';
    });

    it('answers failed when only the failed link itself reported a load', () => {
      render(URL);
      act(() => {
        webView().props.onLoad({nativeEvent: {url: URL}});
        webView().props.onError({
          nativeEvent: {code: -6, canGoBack: false, url: URL},
        });
      });
      expect(lastStatus()).toBe('failed');
    });

    it('ignores a later error after another page loaded, whatever canGoBack says', () => {
      render(URL);
      act(() => {
        webView().props.onLoad({nativeEvent: {url: URL}});
        webView().props.onLoad({nativeEvent: {url: `${URL}/dead`}});
        webView().props.onError({
          nativeEvent: {code: -6, canGoBack: false, url: `${URL}/dead`},
        });
      });
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  it('on iOS ignores a later error reported against the page that loaded', () => {
    render(URL);
    act(() => {
      webView().props.onLoad({nativeEvent: {url: URL}});
      webView().props.onError({
        nativeEvent: {code: -1004, canGoBack: false, url: URL},
      });
    });
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('answers only once per link', () => {
    render(URL);
    act(() => {
      webView().props.onMessage({nativeEvent: {data: COMPLETION}});
      tree.root.findByProps({testID: 'uae-pass-close'}).props.onPress();
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('answers again for a new link', () => {
    render(URL);
    act(() => webView().props.onMessage({nativeEvent: {data: COMPLETION}}));
    act(() => tree.update(<UaePassSheet url={null} onComplete={onComplete} />));
    act(() =>
      tree.update(<UaePassSheet url={`${URL}/2`} onComplete={onComplete} />),
    );
    act(() => webView().props.onMessage({nativeEvent: {data: COMPLETION}}));
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  it('loads http(s) links and hands other links to the OS', () => {
    render(URL);
    const shouldStart = webView().props.onShouldStartLoadWithRequest;
    expect(shouldStart({url: 'https://stg-id.uaepass.ae/authorize'})).toBe(
      true,
    );
    expect(shouldStart({url: 'about:blank'})).toBe(true);
    expect(shouldStart({url: 'uaepass://digitalid/login'})).toBe(false);
    expect(Linking.openURL).toHaveBeenCalledWith('uaepass://digitalid/login');
  });

  describe('intent:// links', () => {
    const fallback = 'https://stg-id.uaepass.ae/login?a=1';
    const intent = `intent://login#Intent;scheme=uaepass;S.browser_fallback_url=${encodeURIComponent(
      fallback,
    )};end`;

    it('opens the app link the intent stands for', async () => {
      render(URL);
      expect(webView().props.onShouldStartLoadWithRequest({url: intent})).toBe(
        false,
      );
      await flush();
      expect(Linking.openURL).toHaveBeenCalledWith('uaepass://login');
      expect(mockInjectJavaScript).not.toHaveBeenCalled();
    });

    it('loads the fallback in the sheet when the app cannot open', async () => {
      jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('no app'));
      render(URL);
      webView().props.onShouldStartLoadWithRequest({url: intent});
      await flush();
      expect(mockInjectJavaScript).toHaveBeenCalledWith(
        `window.location.href = ${JSON.stringify(fallback)}; true;`,
      );
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('stays on the page when nothing can open', async () => {
      jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('no app'));
      render(URL);
      webView().props.onShouldStartLoadWithRequest({
        url: 'intent://login#Intent;scheme=uaepass;end',
      });
      await flush();
      expect(mockInjectJavaScript).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
      expect(tree.root.findByType(Modal).props.visible).toBe(true);
    });
  });

  it('hides the loader on errors and full progress', () => {
    const loaders = () =>
      tree.root.findAll(node => node.type === 'ActivityIndicator');
    render(URL);
    act(() =>
      webView().props.onError({nativeEvent: {code: -6, canGoBack: true}}),
    );
    expect(loaders()).toHaveLength(0);
    act(() => webView().props.onLoadStart());
    expect(loaders().length).toBeGreaterThan(0);
    act(() => webView().props.onLoadProgress({nativeEvent: {progress: 1}}));
    expect(loaders()).toHaveLength(0);
  });

  it('shows a loader until the page loads', () => {
    render(URL);
    const loaders = () =>
      tree.root.findAll(node => node.type === 'ActivityIndicator');
    expect(loaders().length).toBeGreaterThan(0);
    act(() => webView().props.onLoadEnd());
    expect(loaders()).toHaveLength(0);
  });
});
