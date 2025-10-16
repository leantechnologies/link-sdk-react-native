import {it, describe, beforeEach, jest} from '@jest/globals';

// Mock the dependencies
jest.mock('react-native-url-polyfill', () => ({
  URL: global.URL,
  URLSearchParams: global.URLSearchParams,
}));

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
}));

jest.mock('../src/components/LinkSDK/Logger', () => ({
  info: jest.fn(),
}));

import LeanWebClient from '../src/components/LinkSDK/LeanWebClient';

describe('LeanWebClient', () => {
  beforeEach(() => {
    // Reset the response listener before each test
    LeanWebClient.responseListener = null;
  });

  describe('getResponseFromParams', () => {
    it('should extract all response parameters including user_exit_intent', () => {
      const testUrl = 'leanlink://success?status=SUCCESS&message=Test message&last_api_response=test_response&exit_point=SUCCESS&exit_intent_point=CONSENT&exit_survey_reason=user_cancelled&user_exit_intent=USER_CANCELLED_PAYMENT&lean_correlation_id=12345&secondary_status=SUCCESS&bank_identifier=DIB_UAE&bank_is_supported=true';

      const result = LeanWebClient.getResponseFromParams(testUrl);

      expect(result).toEqual({
        status: 'SUCCESS',
        message: 'Test message',
        last_api_response: 'test_response',
        exit_point: 'SUCCESS',
        exit_intent_point: 'CONSENT',
        exit_survey_reason: 'user_cancelled',
        user_exit_intent: 'USER_CANCELLED_PAYMENT',
        lean_correlation_id: '12345',
        secondary_status: 'SUCCESS',
        bank: {
          bank_identifier: 'DIB_UAE',
          is_supported: true,
        },
      });
    });

    it('should handle missing user_exit_intent parameter', () => {
      const testUrl = 'leanlink://success?status=SUCCESS&message=Test message';

      const result = LeanWebClient.getResponseFromParams(testUrl);

      expect(result.user_exit_intent).toBeNull();
    });

    it('should handle user_exit_intent as USER_CANCELLED_PAYMENT', () => {
      const testUrl = 'leanlink://success?status=SUCCESS&user_exit_intent=USER_CANCELLED_PAYMENT';

      const result = LeanWebClient.getResponseFromParams(testUrl);

      expect(result.user_exit_intent).toBe('USER_CANCELLED_PAYMENT');
    });

    it('should handle user_exit_intent as USER_COMPLETED_PAYMENT', () => {
      const testUrl = 'leanlink://success?status=SUCCESS&user_exit_intent=USER_COMPLETED_PAYMENT';

      const result = LeanWebClient.getResponseFromParams(testUrl);

      expect(result.user_exit_intent).toBe('USER_COMPLETED_PAYMENT');
    });

    it('should handle empty user_exit_intent parameter', () => {
      const testUrl = 'leanlink://success?status=SUCCESS&user_exit_intent=';

      const result = LeanWebClient.getResponseFromParams(testUrl);

      expect(result.user_exit_intent).toBe('');
    });

    it('should handle all parameters as null when not present', () => {
      const testUrl = 'leanlink://success';

      const result = LeanWebClient.getResponseFromParams(testUrl);

      expect(result).toEqual({
        status: null,
        message: null,
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
    });
  });

  describe('onRedirectResponse', () => {
    it('should call the response listener with the provided response', () => {
      const mockCallback = jest.fn();
      LeanWebClient.responseListener = mockCallback;

      const testResponse = {
        status: 'SUCCESS',
        message: 'Test message',
        user_exit_intent: 'true',
      };

      LeanWebClient.onRedirectResponse(testResponse);

      expect(mockCallback).toHaveBeenCalledWith(testResponse);
    });

    it('should handle response with user_exit_intent', () => {
      const mockCallback = jest.fn();
      LeanWebClient.responseListener = mockCallback;

      const testResponse = {
        status: 'CANCELLED',
        message: 'User cancelled payment',
        user_exit_intent: 'USER_CANCELLED_PAYMENT',
        exit_point: 'PAYMENT',
      };

      LeanWebClient.onRedirectResponse(testResponse);

      expect(mockCallback).toHaveBeenCalledWith(testResponse);
    });
  });

  describe('handleOverrideUrlLoading', () => {
    it('should set response listener when callback is provided', () => {
      const mockCallback = jest.fn();
      const mockEvent = {
        url: 'leanlink://success?status=SUCCESS&user_exit_intent=true',
      };

      LeanWebClient.handleOverrideUrlLoading(mockEvent, mockCallback);

      expect(LeanWebClient.responseListener).toBe(mockCallback);
    });

    it('should handle leanlink protocol with user_exit_intent', () => {
      const mockCallback = jest.fn();
      const mockEvent = {
        url: 'leanlink://success?status=SUCCESS&message=Test&user_exit_intent=USER_COMPLETED_PAYMENT',
      };

      LeanWebClient.handleOverrideUrlLoading(mockEvent, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith({
        status: 'SUCCESS',
        message: 'Test',
        last_api_response: null,
        exit_point: null,
        exit_intent_point: null,
        exit_survey_reason: null,
        user_exit_intent: 'USER_COMPLETED_PAYMENT',
        lean_correlation_id: null,
        secondary_status: null,
        bank: {
          bank_identifier: null,
          is_supported: false,
        },
      });
    });

    it('should handle redirect hostname with user_exit_intent set to null', () => {
      const mockCallback = jest.fn();
      const mockEvent = {
        url: 'leanlink://redirect',
      };

      LeanWebClient.handleOverrideUrlLoading(mockEvent, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith({
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
    });
  });
});

