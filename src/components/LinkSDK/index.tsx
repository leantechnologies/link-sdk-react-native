import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  ForwardedRef,
} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

import LeanWebClient from './LeanWebClient';
import Lean, {Methods} from './Lean';
import Logger from './Logger';
import UaePass from './UaePass';
import UaePassSheet from './UaePassSheet';
import {LinkSDKProps, LinkSDKRef, LeanCallbackResponse} from '../../types/sdk';
import {LeanCountry, LeanEnvironment, LeanLanguage} from '../../types';

export * from '../../types';

const LinkSDK = forwardRef<LinkSDKRef, LinkSDKProps>(
  (props, ref: ForwardedRef<LinkSDKRef>) => {
    // create state to manage SDK visibility
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Dynamically set URL for start SDK methods
    const [initializationURL, setInitializationURL] = useState<string>('');

    // UAE PASS opens in a second WebView over the SDK, which stays mounted underneath
    const sdkWebView = useRef<WebView>(null);
    const [uaePassUrl, setUaePassUrl] = useState<string | null>(null);
    // A ref, so a request fired twice in the same tick is still seen as a duplicate
    const isUaePassOpen = useRef<boolean>(false);

    const closeUaePass = (): void => {
      isUaePassOpen.current = false;
      setUaePassUrl(null);
    };

    // The SDK waits for exactly one answer per UAE PASS request
    const answerUaePass = (message: string): void => {
      closeUaePass();
      sdkWebView.current?.injectJavaScript(UaePass.buildInjection(message));
    };

    const handleUaePassRequest = (url: string): void => {
      if (isUaePassOpen.current) {
        Logger.info('UAE PASS request ignored, sheet already open', url);
        return;
      }
      const target = UaePass.getTargetUrl(url);
      if (target) {
        isUaePassOpen.current = true;
        setUaePassUrl(target);
      } else {
        answerUaePass(UaePass.buildMessage('failed'));
      }
    };

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
      closeUaePass();
      if (props.callback) {
        props.callback(data);
      }
    };

    return (
      <Modal visible={isOpen} transparent>
        <View
          style={[
            styles.container,
            {paddingBottom: props.customization?.bottom_inset ?? 0},
          ]}>
          <WebView
            ref={sdkWebView}
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
                handleUaePassRequest,
              )
            }
            onNavigationStateChange={event =>
              // UAE PASS requests are already handled by onShouldStartLoadWithRequest
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
                handleUaePassRequest,
              );
            }}
            cacheEnabled={false}
            javaScriptEnabledAndroid={true}
            javaScriptCanOpenWindowsAutomatically
            onLoadStart={LeanWebClient.onPageStarted}
            onLoadEnd={LeanWebClient.onPageFinished}
          />
          <UaePassSheet url={uaePassUrl} onComplete={answerUaePass} />
        </View>
      </Modal>
    );
  },
);

LinkSDK.displayName = 'LinkSDK';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default LinkSDK;
