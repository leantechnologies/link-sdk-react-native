import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';

import Logger from './Logger';
import UaePass from './UaePass';

interface UaePassSheetProps {
  // The UAE PASS link to show, null keeps the sheet closed
  url: string | null;
  // Called once per link with the JSON message to hand back to the SDK
  onComplete: (message: string) => void;
}

const CLOSE_HIT_SLOP = {top: 12, bottom: 12, left: 12, right: 12};

// iOS reports redirects (-999) and navigations handed to another app (102) as errors
const IGNORED_ERROR_CODES = [-999, 102];

const UaePassSheet = ({url, onComplete}: UaePassSheetProps) => {
  // Keeps the page on screen while the sheet slides out
  const [shownUrl, setShownUrl] = useState<string | null>(url);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasCompleted = useRef<boolean>(false);
  const loadedUrls = useRef<Set<string>>(new Set());
  const webView = useRef<WebView>(null);

  useEffect(() => {
    if (!url) {
      return;
    }
    setShownUrl(url);
    hasCompleted.current = false;
    loadedUrls.current = new Set();
    setIsLoading(true);
  }, [url]);

  const complete = (message: string): void => {
    if (hasCompleted.current) {
      return;
    }
    hasCompleted.current = true;
    onComplete(message);
  };

  const cancel = (): void => complete(UaePass.buildMessage('cancelled'));

  // Android pages hand off to apps with intent:// links, which Linking cannot open
  const openIntent = (link: string): void => {
    const {appUrl, fallbackUrl} = UaePass.parseIntentUrl(link);
    const openFallback = (): void => {
      if (fallbackUrl) {
        webView.current?.injectJavaScript(
          `window.location.href = ${JSON.stringify(fallbackUrl)}; true;`,
        );
      } else {
        Logger.info('UAE PASS intent not opened', link);
      }
    };
    if (appUrl) {
      Linking.openURL(appUrl).catch(openFallback);
    } else {
      openFallback();
    }
  };

  const openExternally = (link: string): void => {
    if (link.startsWith('intent://')) {
      openIntent(link);
      return;
    }
    Linking.openURL(link).catch(error =>
      Logger.info('UAE PASS link not opened', error),
    );
  };

  return (
    <Modal visible={!!url} animationType="slide" onRequestClose={cancel}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            testID="uae-pass-close"
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={CLOSE_HIT_SLOP}
            onPress={cancel}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {!!shownUrl && (
            <WebView
              key={shownUrl}
              ref={webView}
              testID="uae-pass-webview"
              style={styles.webView}
              originWhitelist={['*']}
              source={{uri: shownUrl}}
              setSupportMultipleWindows={false}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onLoad={event => {
                loadedUrls.current.add(event.nativeEvent.url);
              }}
              onLoadProgress={event => {
                // Android can start another load after an error and never end it
                if (event.nativeEvent.progress >= 1) {
                  setIsLoading(false);
                }
              }}
              onError={event => {
                Logger.info('UAE PASS load error', event.nativeEvent);
                setIsLoading(false);
                // Only the link itself failing to open is a failure, the user can close on later errors.
                // iOS never reports onLoad for a failed page, Android does (and sets canGoBack unreliably)
                const {url: failedUrl, canGoBack, code} = event.nativeEvent;
                const hasLoadedPage = [...loadedUrls.current].some(
                  loaded => Platform.OS === 'ios' || loaded !== failedUrl,
                );
                if (
                  !canGoBack &&
                  !hasLoadedPage &&
                  !IGNORED_ERROR_CODES.includes(code)
                ) {
                  complete(UaePass.buildMessage('failed'));
                }
              }}
              onMessage={event => {
                const message = UaePass.parseCompletionMessage(
                  event.nativeEvent.data,
                );
                if (message) {
                  complete(message);
                }
              }}
              onShouldStartLoadWithRequest={event => {
                // Web schemes load in the sheet, frames can navigate to data: and blob: URLs
                if (/^(https?|about|data|blob|javascript):/i.test(event.url)) {
                  return true;
                }
                // App links such as uaepass:// belong to the OS, not the WebView
                openExternally(event.url);
                return false;
              }}
            />
          )}
          {isLoading && (
            <View style={styles.loader} pointerEvents="none">
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  close: {
    fontSize: 20,
    color: 'black',
  },
  content: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UaePassSheet;
