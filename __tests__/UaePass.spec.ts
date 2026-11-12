import {it, describe, expect, jest} from '@jest/globals';

import UaePass from '../src/components/LinkSDK/UaePass';

const ACTIVATION_URL =
  'https://stg-id.uaepass.ae/idshub/authorize?response_type=code&scope=urn:uae:digitalid:profile:general urn:uae:digitalid:profile:general:profileType&redirect_uri=https%3A%2F%2Fidenfo.test%2Fcallback&state=a|b';

const request = (url: string) =>
  `leanlink://uae_pass?url=${encodeURIComponent(url)}`;

describe('UaePass', () => {
  describe('isRequest', () => {
    it('matches UAE PASS requests', () => {
      expect(UaePass.isRequest(request(ACTIVATION_URL))).toBe(true);
      expect(UaePass.isRequest('leanlink://uae_pass/?url=x')).toBe(true);
      expect(UaePass.isRequest('leanlink://uae_pass')).toBe(true);
    });

    it('ignores other leanlink callbacks and URLs', () => {
      expect(UaePass.isRequest('leanlink://success?status=SUCCESS')).toBe(
        false,
      );
      expect(UaePass.isRequest('leanlink://redirect?status=SUCCESS')).toBe(
        false,
      );
      expect(UaePass.isRequest('leanlink://uae_passport?url=x')).toBe(false);
      expect(UaePass.isRequest('https://example.com/leanlink://uae_pass')).toBe(
        false,
      );
    });
  });

  describe('getTargetUrl', () => {
    it('decodes the link and percent-encodes characters a WebView will not load', () => {
      expect(UaePass.getTargetUrl(request(ACTIVATION_URL))).toBe(
        'https://stg-id.uaepass.ae/idshub/authorize?response_type=code&scope=urn:uae:digitalid:profile:general%20urn:uae:digitalid:profile:general:profileType&redirect_uri=https%3A%2F%2Fidenfo.test%2Fcallback&state=a%7Cb',
      );
    });

    it('encodes a percent sign that does not start an escape', () => {
      expect(
        UaePass.getTargetUrl(request('https://idenfo.test/a?x=50%off&y=%20')),
      ).toBe('https://idenfo.test/a?x=50%25off&y=%20');
    });

    it('keeps an already valid link unchanged', () => {
      const url = 'https://idenfo.test/session/abc?x=1&y=%20';
      expect(UaePass.getTargetUrl(request(url))).toBe(url);
    });

    it('finds url among other params', () => {
      const url = 'https://idenfo.test/session';
      expect(
        UaePass.getTargetUrl(
          `leanlink://uae_pass?foo=bar&url=${encodeURIComponent(url)}`,
        ),
      ).toBe(url);
    });

    it('returns null when the link is missing, malformed or not http(s)', () => {
      expect(UaePass.getTargetUrl('leanlink://uae_pass')).toBeNull();
      expect(UaePass.getTargetUrl('leanlink://uae_pass?url=')).toBeNull();
      expect(
        UaePass.getTargetUrl('leanlink://uae_pass?url=%E0%A4%A'),
      ).toBeNull();
      expect(
        UaePass.getTargetUrl(request('ftp://idenfo.test/session')),
      ).toBeNull();
      expect(UaePass.getTargetUrl(request('uaepass://login'))).toBeNull();
    });
  });

  describe('parseIntentUrl', () => {
    const fallback = 'https://stg-id.uaepass.ae/idshub/authorize?a=1&b=2';

    it('builds the app link and the fallback', () => {
      expect(
        UaePass.parseIntentUrl(
          `intent://digitalid/login?x=1#Intent;scheme=uaepass;package=ae.uaepass.mainapp;S.browser_fallback_url=${encodeURIComponent(
            fallback,
          )};end`,
        ),
      ).toEqual({
        appUrl: 'uaepass://digitalid/login?x=1',
        fallbackUrl: fallback,
      });
    });

    it('returns only what the intent carries', () => {
      expect(
        UaePass.parseIntentUrl('intent://login#Intent;scheme=uaepass;end'),
      ).toEqual({appUrl: 'uaepass://login', fallbackUrl: null});
      expect(
        UaePass.parseIntentUrl(
          `intent://login#Intent;package=x;S.browser_fallback_url=${encodeURIComponent(
            fallback,
          )};end`,
        ),
      ).toEqual({appUrl: null, fallbackUrl: fallback});
    });

    it('rejects unsafe or malformed parts', () => {
      expect(
        UaePass.parseIntentUrl(
          'intent://x#Intent;scheme=java script;S.browser_fallback_url=javascript%3Aalert(1);end',
        ),
      ).toEqual({appUrl: null, fallbackUrl: null});
      expect(
        UaePass.parseIntentUrl(
          'intent://x#Intent;S.browser_fallback_url=%E0%A4%A;end',
        ),
      ).toEqual({appUrl: null, fallbackUrl: null});
      expect(UaePass.parseIntentUrl('intent://x')).toEqual({
        appUrl: null,
        fallbackUrl: null,
      });
      expect(UaePass.parseIntentUrl('uaepass://x#Intent;scheme=a;end')).toEqual(
        {appUrl: null, fallbackUrl: null},
      );
    });
  });

  describe('parseCompletionMessage', () => {
    const message = {
      source: 'idenfo',
      event: 'uae-pass-sdk-complete',
      status: 'success',
      ref: 'ref-1',
      uaePassData: {idn: '784-1990-1234567-1'},
    };

    it('accepts the Idenfo completion message', () => {
      expect(
        JSON.parse(UaePass.parseCompletionMessage(JSON.stringify(message))!),
      ).toEqual(message);
    });

    it('accepts every status', () => {
      for (const status of ['success', 'cancelled', 'failed']) {
        expect(
          UaePass.parseCompletionMessage(JSON.stringify({...message, status})),
        ).not.toBeNull();
      }
    });

    it('rejects anything else', () => {
      expect(UaePass.parseCompletionMessage('not json')).toBeNull();
      expect(UaePass.parseCompletionMessage(undefined)).toBeNull();
      expect(UaePass.parseCompletionMessage('"idenfo"')).toBeNull();
      expect(UaePass.parseCompletionMessage('null')).toBeNull();
      expect(UaePass.parseCompletionMessage('[]')).toBeNull();
      expect(
        UaePass.parseCompletionMessage(
          JSON.stringify({...message, source: 'other'}),
        ),
      ).toBeNull();
      expect(
        UaePass.parseCompletionMessage(
          JSON.stringify({...message, event: 'other'}),
        ),
      ).toBeNull();
      expect(
        UaePass.parseCompletionMessage(
          JSON.stringify({...message, status: 'pending'}),
        ),
      ).toBeNull();
    });
  });

  describe('buildMessage', () => {
    it('builds the message the SDK expects', () => {
      expect(JSON.parse(UaePass.buildMessage('cancelled'))).toEqual({
        source: 'idenfo',
        event: 'uae-pass-sdk-complete',
        status: 'cancelled',
        ref: null,
      });
    });
  });

  describe('buildInjection', () => {
    it('posts the message as an object literal', () => {
      const message = UaePass.buildMessage('failed');
      const postMessage = jest.fn();
      // eslint-disable-next-line no-new-func
      new Function('window', UaePass.buildInjection(message))({postMessage});
      expect(postMessage).toHaveBeenCalledWith(JSON.parse(message), '*');
    });

    it('escapes line separators', () => {
      const injection = UaePass.buildInjection('{"name":"a\u2028b\u2029c"}');
      expect(injection).not.toMatch(/[\u2028\u2029]/);
      expect(injection).toContain('a\\u2028b\\u2029c');
    });
  });
});
