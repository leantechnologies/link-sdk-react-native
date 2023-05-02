import {Linking} from 'react-native';
import Logger from './Logger';

class LeanWebClient {
  static responseListener = null;

  static onPageStarted() {
    Logger.info('SDK initialization started');
  }

  static onPageFinished() {
    Logger.info('SDK initialization completed');
  }

  static getResponseFromParams(url) {
    const urlObject = new URL(url);
    const urlParams = new URLSearchParams(urlObject.search);

    return {
      status: urlParams.get('status'),
      message: urlParams.get('message'),
      lastApiResponse: urlParams.get('last_api_response'),
      exitPoint: urlParams.get('exit_point'),
      secondaryStatus: urlParams.get('secondary_status'),
      bank: {
        bankId: urlParams.get('bank_identifier'),
        isSupported: Boolean(urlParams.get('bank_is_supported')),
      },
    };
  }

  static handleOverrideUrlLoading(url, callback) {
    if (callback) {
      // Set value for response listener
      this.responseListener = callback;
    }

    const urlObject = new URL(url);
    /**
     * Standard redirect URI from hosted HTML has three parts
     * scheme   - <scheme>://<host>?response_data :: leanlink | https | http
     * host     - <scheme>://<host>?response_data :: success | cancelled | error | redirect (matching callback's response.status)
     * response - <scheme>://<host>?response_data :: response data from redirect (matching callback's response object) is received as query params
     */
    if (urlObject.protocol === 'leanlink:') {
      // Close SDK if it's an internal OpenBanking redirect
      if (urlObject.hostname === 'redirect') {
        this.onRedirectResponse({
          status: 'SUCCESS',
          message: 'Link closed after redirect',
          lastApiResponse: null,
          exitPoint: null,
          secondaryStatus: null,
          bank: {
            bankId: null,
            isSupported: null,
          },
        });
      } else {
        // Send response back caller for proper handling
        this.onRedirectResponse(this.getResponseFromParams(url));
      }

      // Override URL loading
      return true;
    }

    // Open all URLs in default web browser
    Linking.openURL(url);
    // Do not override URL loading
    return false;
  }

  static onRedirectResponse(response) {
    Logger.info(`Response received: ${response}`);
    this.responseListener(response);
  }
}

export default LeanWebClient;
