import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

import LeanWebClient from './LeanWebClient';
import Lean from './Lean';
import {Methods} from './constants';

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

  const callLeanMethod = method => config => {
    setIsOpen(true);
    setInitializationURL(lean[method](config));
  };

  useImperativeHandle(ref, () => ({
    link: callLeanMethod(Methods.LINK),
    connect: callLeanMethod(Methods.CONNECT),
    reconnect: callLeanMethod(Methods.RECONNECT),
    createBeneficiary: callLeanMethod(Methods.CREATE_BENEFICIARY),
    createPaymentSource: callLeanMethod(Methods.CREATE_PAYMENT_SOURCE),
    updatePaymentSource: callLeanMethod(Methods.UPDATE_PAYMENT_SOURCE),
    pay: callLeanMethod(Methods.PAY),
    verifyAddress: callLeanMethod(Methods.VERIFY_ADDRESS),
    authorizeConsent: callLeanMethod(Methods.AUTHORIZE_CONSENT),
    checkout: callLeanMethod(Methods.CHECKOUT),
    manageConsents: callLeanMethod(Methods.MANAGE_CONSENTS),
    captureRedirect: callLeanMethod(Methods.CAPTURE_REDIRECT),
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
