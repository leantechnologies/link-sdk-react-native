export type UaePassStatus = 'success' | 'cancelled' | 'failed';

const REQUEST_PATTERN = /^leanlink:\/\/uae_pass\/?(\?|$)/;
const ILLEGAL_URL_CHARACTERS = /[^A-Za-z0-9\-._~!*'();:@&=+$,/?%#[\]]/g;
const STRAY_PERCENT = /%(?![0-9A-Fa-f]{2})/g;
const HTTP_URL = /^https?:\/\/[^/?#\s]+/i;
const STATUSES: UaePassStatus[] = ['success', 'cancelled', 'failed'];

const SOURCE = 'idenfo';
const EVENT = 'uae-pass-sdk-complete';

class UaePass {
  static isRequest(url: string): boolean {
    return REQUEST_PATTERN.test(url);
  }

  /**
   * Extracts the UAE PASS link from leanlink://uae_pass?url=<encoded link>.
   * Returns null when the link is missing, malformed or not http(s).
   */
  static getTargetUrl(url: string): string | null {
    // The URL polyfill does not implement searchParams.get, so parse by hand
    const query = url.split('?').slice(1).join('?');
    const param = query.split('&').find(pair => pair.startsWith('url='));
    if (!param) {
      return null;
    }

    let target: string;
    try {
      target = decodeURIComponent(param.slice('url='.length)).trim();
    } catch {
      return null;
    }

    if (!HTTP_URL.test(target)) {
      return null;
    }

    // UAE PASS links carry spaces and other characters a WebView will not load
    return target
      .replace(ILLEGAL_URL_CHARACTERS, character =>
        encodeURIComponent(character),
      )
      .replace(STRAY_PERCENT, '%25');
  }

  /**
   * Splits an Android intent:// link into the app link it stands for and
   * its http(s) fallback, either of which may be null.
   * intent://<rest>#Intent;scheme=<scheme>;S.browser_fallback_url=<url>;end
   */
  static parseIntentUrl(url: string): {
    appUrl: string | null;
    fallbackUrl: string | null;
  } {
    const hashIndex = url.indexOf('#Intent;');
    if (!url.startsWith('intent://') || hashIndex < 0) {
      return {appUrl: null, fallbackUrl: null};
    }

    const extras: Record<string, string> = {};
    for (const part of url.slice(hashIndex + '#Intent;'.length).split(';')) {
      const separator = part.indexOf('=');
      if (separator > 0) {
        extras[part.slice(0, separator)] = part.slice(separator + 1);
      }
    }

    const scheme = extras.scheme;
    const appUrl =
      scheme && /^[a-z][a-z0-9+.-]*$/i.test(scheme)
        ? `${scheme}://${url.slice('intent://'.length, hashIndex)}`
        : null;

    let fallbackUrl: string | null = null;
    try {
      const decoded = decodeURIComponent(
        extras['S.browser_fallback_url'] ?? '',
      );
      fallbackUrl = HTTP_URL.test(decoded) ? decoded : null;
    } catch {
      fallbackUrl = null;
    }

    return {appUrl, fallbackUrl};
  }

  /**
   * Returns the completion message as JSON when data is Idenfo's
   * completion message, null otherwise.
   */
  static parseCompletionMessage(data: unknown): string | null {
    if (typeof data !== 'string') {
      return null;
    }

    let message: unknown;
    try {
      message = JSON.parse(data);
    } catch {
      return null;
    }

    if (
      typeof message !== 'object' ||
      message === null ||
      Array.isArray(message)
    ) {
      return null;
    }

    const {source, event, status} = message as Record<string, unknown>;
    if (
      source !== SOURCE ||
      event !== EVENT ||
      !STATUSES.includes(status as UaePassStatus)
    ) {
      return null;
    }

    return JSON.stringify(message);
  }

  static buildMessage(status: UaePassStatus): string {
    return JSON.stringify({source: SOURCE, event: EVENT, status, ref: null});
  }

  static buildInjection(message: string): string {
    // U+2028 and U+2029 are valid in JSON but end a line in older JS engines
    const literal = message
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
    return `window.postMessage(${literal}, '*'); true;`;
  }
}

export default UaePass;
