import React, { useRef, useImperativeHandle, useState, forwardRef } from 'react';
import { WebView } from 'react-native-webview';
import { Dimensions, View, StyleSheet, Linking } from 'react-native';

const LinkSDK = forwardRef((props, ref) => {
  // create a ref for injectJavaScript to use
  const SDK = useRef(null);

  // create state to manage SDK visibility
  const [isOpen, setIsOpen] = useState(false);

  // useImperativeHandle allows the methods to be called outside of the component
  const [injectedJavascript, setInjectedJavascript] = useState("");
  useImperativeHandle(ref, () => ({
    // ALL of these functions **must** have the function passed in as a String
    // ALL of these functions must set up postMessage function to enable callback

    // initialise connect flow
    connect(opts) {
      const keys = Object.keys(opts);

      const call = `
            function postResponse(status) {
                status.method = "CONNECT"
                window.ReactNativeWebView.postMessage(JSON.stringify(status))
            }

            try {
                Lean.connect({
                    ${keys.map(
        (key) => `${key}: ${JSON.stringify(opts[key])}`,
      )},
                    app_token: "${props.appToken}",
                    sandbox: ${props.sandbox},
                    callback: postResponse
                })
            } catch (e) {
                postResponse({ method: "CONNECT", status: "ERROR", message: "Lean not initialized" })
            }
            `;
      setInjectedJavascript(call);
      setIsOpen(true);
    },

    // initialise link flow
    link(opts) {
      const keys = Object.keys(opts);

      const call = `
            function postResponse(status) {
                status.method = "LINK"
                window.ReactNativeWebView.postMessage(JSON.stringify(status))
            }

            try {
                Lean.link({
                    ${keys.map(
        (key) => `${key}: ${JSON.stringify(opts[key])}`,
      )},
                    app_token: "${props.appToken}",
                    sandbox: ${props.sandbox},
                    callback: postResponse
                })
            } catch (e) {
                postResponse({ method: "LINK", status: "ERROR", message: "Lean not initialized" })
            }
            `;

      setInjectedJavascript(call);
      setIsOpen(true);
    },

    // initialise reconnect flow
    reconnect(opts) {
      setIsOpen(true);
      const keys = Object.keys(opts);

      const call = `
            function postResponse(status) {
                status.method = "RECONNECT"
                window.ReactNativeWebView.postMessage(JSON.stringify(status))
            }

            try {
                Lean.reconnect({
                    ${keys.map(
        (key) => `${key}: ${JSON.stringify(opts[key])}`,
      )},
                    app_token: "${props.appToken}",
                    sandbox: ${props.sandbox},
                    callback: postResponse
                })
            } catch (e) {
                postResponse({ method: "RECONNECT", status: "ERROR", message: "Lean not initialized" })
            }
            `;

      setInjectedJavascript(call);
      setIsOpen(true);
    },

    // initialise CPS flow
    createPaymentSource(opts) {
      const keys = Object.keys(opts);

      const call = `
            function postResponse(status) {
                status.method = "CREATE_PAYMENT_SOURCE"
                window.ReactNativeWebView.postMessage(JSON.stringify(status))
            }

            try {
                Lean.createPaymentSource({
                    ${keys.map(
        (key) => `${key}: ${JSON.stringify(opts[key])}`,
      )},
                    app_token: "${props.appToken}",
                    sandbox: ${props.sandbox},
                    callback: postResponse
                })
            } catch (e) {
                postResponse({ method: "CREATE_PAYMENT_SOURCE", status: "ERROR", message: "Lean not initialized" })
            }
            `;
      setInjectedJavascript(call);
      setIsOpen(true);
    },

    // initialise pay flow
    pay(opts) {
      const keys = Object.keys(opts);

      const call = `
            function postResponse(status) {
                status.method = "PAY"
                window.ReactNativeWebView.postMessage(JSON.stringify(status))
            }

            try {
                Lean.pay({
                    ${keys.map(
        (key) => `${key}: ${JSON.stringify(opts[key])}`,
      )},
                    app_token: "${props.appToken}",
                    sandbox: ${props.sandbox},
                    callback: postResponse
                })
            } catch (e) {
                postResponse({ method: "PAY", status: "ERROR", message: "Lean not initialized" })
            }
            `;

      setInjectedJavascript(call);
      setIsOpen(true);
    },

    // updatePaymentSource flow
    updatePaymentSource(opts) {
      const keys = Object.keys(opts);

      const call = `
            function postResponse(status) {
                status.method = "UPDATE_PAYMENT_SOURCE"
                window.ReactNativeWebView.postMessage(JSON.stringify(status))
            }

            try {
                Lean.updatePaymentSource({
                    ${keys.map(
        (key) => `${key}: ${JSON.stringify(opts[key])}`,
      )},
                    app_token: "${props.appToken}",
                    sandbox: ${props.sandbox},
                    callback: postResponse
                })
            } catch (e) {
                postResponse({ method: "UPDATE_PAYMENT_SOURCE", status: "ERROR", message: "Lean not initialized" })
            }
            `;

      setInjectedJavascript(call);
      setIsOpen(true);
    },
  }));

  // The callback fired internally by the SDK to propagate to the user supplied callback and close the webview.
  const internalCallback = (data) => {
    setTimeout(() => setIsOpen(false), 300);
    if (props.callback) {
      props.callback(JSON.parse(data));
    }
  };

  if (!isOpen) return null;

  return (
    <View
      style={isOpen ? styles.container : styles.containerClosed}
      height={Dimensions.get('window').height - (props.offsetTop || 0)}
      width={Dimensions.get('window').width}
    >
      <WebView
        {...props.webViewProps}
        ref={SDK}
        style={styles.WebView}
        originWhitelist={['*']}
        injectedJavaScript={injectedJavascript}
        source={{
          baseUrl: 'https://leantech.me',
          html: require('./base.js')({
            version: props.version,
            country: props.country,
          }),
        }}
        onShouldStartLoadWithRequest={(event) => {
          if (event.url !== 'https://leantech.me/') {
            SDK.current.injectJavaScript(`
              postResponse({ method: "LINK", status: "SUCCESS", message: "User redirected to bank" })
            `);
            Linking.openURL(event.url);
            return false;
          }
          return true;
        }}
        javaScriptEnabledAndroid={true}
        onMessage={(event) => {
          internalCallback(event.nativeEvent.data);
        }}
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
