import {URL, URLSearchParams} from 'react-native-url-polyfill';
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
      last_api_response: urlParams.get('last_api_response'),
      exit_point: urlParams.get('exit_point'),
      exit_intent_point: urlParams.get('exit_intent_point'),
      exit_survey_reason: urlParams.get('exit_survey_reason'),
      user_exit_intent: urlParams.get('user_exit_intent'),
      lean_correlation_id: urlParams.get('lean_correlation_id'),
      secondary_status: urlParams.get('secondary_status'),
      bank: {
        bank_identifier: urlParams.get('bank_identifier'),
        is_supported: Boolean(urlParams.get('bank_is_supported')),
      },
    };
  }

  static handleOverrideUrlLoading(event, callback) {
    Logger.info('handleOverrideUrlLoading', event.url);

    if (event.url.startsWith('file://') || event.url === 'about:blank') {
      return false;
    }

    if (event.url.includes('https://cdn.leantech.me/link/loader')) {
      return true;
    }

    if (callback) {
      // Set value for response listener
      this.responseListener = callback;
    }

    const urlObject = new URL(event.url);

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
          last_api_response: null,
          exit_point: null,
          exit_intent_point: null,
          exit_survey_reason: null,
          user_exit_intent: null,
          lean_correlation_id: null,
          secondary_status: null,
          bank: {
            bank_identifier: null,
            is_supported: false,
          },
        });

        // Do not override URL loading
        return false;
      }

      // Send response back caller for proper handling
      this.onRedirectResponse(this.getResponseFromParams(event.url));

      // Do not override URL loading
      return false;
    }

    // Open all URLs in default web browser
    Linking.openURL(event.url);

    // Do not override URL loading
    return false;
  }

  static onRedirectResponse(response) {
    Logger.info('Response received', response);
    this.responseListener(response);
  }
}

export default LeanWebClient;
