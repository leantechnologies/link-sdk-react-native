import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  ForwardedRef,
} from 'react';
import {Modal, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

import LeanWebClient from './LeanWebClient';
import Lean, {Methods} from './Lean';
import {LinkSDKProps, LinkSDKRef, LeanCallbackResponse} from '../../types/sdk';
import {LeanCountry, LeanEnvironment, LeanLanguage} from '../../types';

export * from '../../types';

const LinkSDK = forwardRef<LinkSDKRef, LinkSDKProps>(
  (props, ref: ForwardedRef<LinkSDKRef>) => {
    // create state to manage SDK visibility
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Dynamically set URL for start SDK methods
    const [initializationURL, setInitializationURL] = useState<string>('');

    const lean = new Lean({
      appToken: props.appToken,
      env: props.env || LeanEnvironment.Production,
      country: props.country || LeanCountry.AE,
      language: props.language || LeanLanguage.EN,
      isSandbox: props.sandbox || false,
      showLogs: props.showLogs || false,
      version: props.version || 'latest',
      customization: props.customization || null,
    });

    // Helper function to create method wrappers that follow the same pattern
    const createMethodWrapper = <T extends keyof Lean>(methodName: T) => {
      return (params: Parameters<Lean[T]>[0]) => {
        setIsOpen(true);
        setInitializationURL(
          (lean[methodName] as (params: Parameters<Lean[T]>[0]) => string)(
            params,
          ),
        );
      };
    };

    useImperativeHandle(ref, () => ({
      link: createMethodWrapper(Methods.LINK),
      connect: createMethodWrapper(Methods.CONNECT),
      reconnect: createMethodWrapper(Methods.RECONNECT),
      createBeneficiary: createMethodWrapper(Methods.CREATE_BENEFICIARY),
      createPaymentSource: createMethodWrapper(Methods.CREATE_PAYMENT_SOURCE),
      updatePaymentSource: createMethodWrapper(Methods.UPDATE_PAYMENT_SOURCE),
      pay: createMethodWrapper(Methods.PAY),
      verifyAddress: createMethodWrapper(Methods.VERIFY_ADDRESS),
      authorizeConsent: createMethodWrapper(Methods.AUTHORIZE_CONSENT),
      checkout: createMethodWrapper(Methods.CHECKOUT),
      manageConsents: createMethodWrapper(Methods.MANAGE_CONSENTS),
      captureRedirect: createMethodWrapper(Methods.CAPTURE_REDIRECT),
    }));

    // The callback fired internally by the SDK to propagate to the user supplied callback and close the webview.
    const responseCallbackHandler = (data: LeanCallbackResponse): void => {
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
            LeanWebClient.handleOverrideUrlLoading(
              event,
              responseCallbackHandler,
            )
          }
          onNavigationStateChange={event =>
            LeanWebClient.handleOverrideUrlLoading(
              event,
              responseCallbackHandler,
            )
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
  },
);

LinkSDK.displayName = 'LinkSDK';

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
