import React, {useRef, useState, forwardRef} from 'react';
import {WebView} from 'react-native-webview';
import {Dimensions, View, StyleSheet} from 'react-native';
import LeanWebClient from './LeanWebClient';
import Lean from './Lean';

const LinkSDK = forwardRef((props) => {
  // create a ref for injectJavaScript to use
  const SDK = useRef(null);

  // create state to manage SDK visibility
  const [isOpen, setIsOpen] = useState(false);

  // Dynamically set URL for start SDK methods
  const [initializationURL, setInitializationURL] = useState(false);

  // The callback fired internally by the SDK to propagate to the user supplied callback and close the webview.
  const responseCallbackHandler = (data) => {
    setTimeout(() => setIsOpen(false), 300);
    if (props.callback) {
      props.callback(JSON.parse(data));
    }
  };

  const lean = new Lean({
    appToken: props.appToken,
    isSandbox: props.sandbox || false,
    country: props.country || 'ae',
    language: props.language || 'en',
    version: props.version || 'latest',
    showLogs: props.showLogs || false,
    env: props.env || 'production',
  });

  // Setup Lean object as ref
  SDK.current = {
    link: (config) => {
      setInitializationURL(lean.link(config));
    },
    connect: (config) => {
      setInitializationURL(lean.connect(config));
    },
    reconnect: (config) => {
      setInitializationURL(lean.reconnect(config));
    },
    createBeneficiary: (config) => {
      setInitializationURL(lean.createBeneficiary(config));
    },
    createPaymentSource: (config) => {
      setInitializationURL(lean.createPaymentSource(config));
    },
    updatePaymentSource: (config) => {
      setInitializationURL(lean.updatePaymentSource(config));
    },
    pay: (config) => {
      setInitializationURL(lean.pay(config));
    },
  };

  return (
    <View
      style={isOpen ? styles.container : styles.containerClosed}
      height={Dimensions.get('window').height}
      width={Dimensions.get('window').width}>
      <WebView
        {...props.webViewProps}
        style={styles.WebView}
        originWhitelist={['*']}
        source={{uri: initializationURL}}
        onShouldStartLoadWithRequest={(event) => {
          LeanWebClient.handleOverrideUrlLoading(
            event.url,
            responseCallbackHandler,
          );
        }}
        javaScriptEnabledAndroid={true}
        onLoadStart={LeanWebClient.onPageStarted}
        onLoadEnd={LeanWebClient.onPageFinished}
      />
    </View>
  );
});

LinkSDK.defaultProps = {
  webViewProps: {},
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  containerClosed: {
    display: 'none',
    position: 'relative',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  WebView: {
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
