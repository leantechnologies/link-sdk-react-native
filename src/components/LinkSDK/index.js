import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

import LeanWebClient from './LeanWebClient';
import Lean from './Lean';

const LinkSDK = forwardRef((props, ref) => {
  // create state to manage SDK visibility
  const [isOpen, setIsOpen] = useState(false);

  // Dynamically set URL for start SDK methods
  const [initializationURL, setInitializationURL] = useState('');

  const lean = new Lean({
    appToken: props.appToken,
    env: props.env || 'production',
    country: props.country || 'ae',
    language: props.language || 'en',
    isSandbox: props.sandbox || false,
    showLogs: props.showLogs || false,
    version: props.version || 'latest',
    customization: props.customization || null,
  });

  useImperativeHandle(ref, () => ({
    link: config => {
      setIsOpen(true);
      setInitializationURL(lean.link(config));
    },
    connect: config => {
      setIsOpen(true);
      setInitializationURL(lean.connect(config));
    },
    reconnect: config => {
      setIsOpen(true);
      setInitializationURL(lean.reconnect(config));
    },
    createBeneficiary: config => {
      setIsOpen(true);
      setInitializationURL(lean.createBeneficiary(config));
    },
    createPaymentSource: config => {
      setIsOpen(true);
      setInitializationURL(lean.createPaymentSource(config));
    },
    updatePaymentSource: config => {
      setIsOpen(true);
      setInitializationURL(lean.updatePaymentSource(config));
    },
    pay: config => {
      setIsOpen(true);
      setInitializationURL(lean.pay(config));
    },
    verifyAddress: config => {
      setIsOpen(true);
      setInitializationURL(lean.verifyAddress(config));
    },
    authorizeConsent: config => {
      setIsOpen(true);
      setInitializationURL(lean.authorizeConsent(config));
    },
  }));

  // The callback fired internally by the SDK to propagate to the user supplied callback and close the webview.
  const responseCallbackHandler = data => {
    setTimeout(() => setIsOpen(false), 300);
    if (props.callback) {
      props.callback(data);
    }
  };

  return (
    <Modal visible={isOpen} transparent>
      <WebView
        {...props.webViewProps}
        style={styles.webView}
        originWhitelist={['*']}
        source={{uri: initializationURL}}
        allowsInlineMediaPlayback={true}
        setSupportMultipleWindows={false}
        mediaPlaybackRequiresUserAction={false}
        onShouldStartLoadWithRequest={event =>
          LeanWebClient.handleOverrideUrlLoading(event, responseCallbackHandler)
        }
        onNavigationStateChange={event =>
          LeanWebClient.handleOverrideUrlLoading(event, responseCallbackHandler)
        }
        onOpenWindow={syntheticEvent => {
          // This is required to manage iOS window.open events.
          // We don't get onNavigationStateChange or onShouldStartLoadWithRequest in iOS for this particular event.
          const {nativeEvent} = syntheticEvent;
          return LeanWebClient.handleOverrideUrlLoading(
            {url: nativeEvent.targetUrl},
            responseCallbackHandler,
          );
        }}
        cacheEnabled={false}
        javaScriptEnabledAndroid={true}
        javaScriptCanOpenWindowsAutomatically
        onLoadStart={LeanWebClient.onPageStarted}
        onLoadEnd={LeanWebClient.onPageFinished}
      />
    </Modal>
  );
});

LinkSDK.defaultProps = {
  webViewProps: {},
};

const styles = StyleSheet.create({
  webView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
});

export default LinkSDK;
