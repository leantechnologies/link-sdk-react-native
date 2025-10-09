import {it} from '@jest/globals';
import Lean from '../src/components/LinkSDK/Lean';
import {config} from './fixtures/config';

const pkg = require('../package.json');

describe('Lean SDK', () => {
  let lean = null;

  // Base URL constant to reduce repetition
  const BASE_URL = `https://cdn.leantech.me/link/loader/prod/ae/latest/lean-sdk.html?implementation=webview-hosted-html&implementation_config=platform+mobile&implementation_config=sdk+react_native&implementation_config=os+ios&implementation_config=sdk_version+${pkg.version}&implementation_config=is_version_pinned+false&app_token=9fb9e934-9efb-4e7e-a508-de67c0839be0&sandbox=false&language=en&version=latest&country=ae&env=production`;

  beforeAll(() => {
    lean = new Lean({
      appToken: config.appToken,
      env: 'production',
      country: 'ae',
      language: 'en',
      isSandbox: false,
      showLogs: false,
      version: 'latest',
      customization: null,
    });
  });

  describe('link', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=link&customer_id=dda80d32-4062-404c-abe7-ba9b9290c873&permissions=identity&permissions=accounts&permissions=balance&permissions=transactions`;

      const initializationURL = lean.link({
        customer_id: config.customerId,
        permissions: ['identity', 'accounts', 'balance', 'transactions'],
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=link&customer_id=dda80d32-4062-404c-abe7-ba9b9290c873&permissions=identity&permissions=accounts&permissions=balance&permissions=transactions&bank_identifier=LEANMB1_SAU&access_token=test&fail_redirect_url=https://dev.leantech.me/fail&success_redirect_url=https://dev.leantech.me/success`;

      const initializationURL = lean.link({
        customer_id: config.customerId,
        permissions: ['identity', 'accounts', 'balance', 'transactions'],
        bank_identifier: 'LEANMB1_SAU',
        access_token: 'test',
        fail_redirect_url: 'https://dev.leantech.me/fail',
        success_redirect_url: 'https://dev.leantech.me/success',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('connect', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=connect&customer_id=dda80d32-4062-404c-abe7-ba9b9290c873&permissions=identity&permissions=accounts&permissions=balance&permissions=transactions`;

      const initializationURL = lean.connect({
        customer_id: config.customerId,
        permissions: ['identity', 'accounts', 'balance', 'transactions'],
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=connect&customer_id=dda80d32-4062-404c-abe7-ba9b9290c873&permissions=identity&permissions=accounts&permissions=balance&permissions=transactions&permissions=payments&bank_identifier=LEANMB1_SAU&end_user_id=626715d7-222f-4087-bcce-2832135e4981&payment_destination_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&access_token=test&access_to=10-10-2023&access_from=10-05-2023&fail_redirect_url=https://dev.leantech.me/fail&success_redirect_url=https://dev.leantech.me/success&show_consent_explanation=true&destination_alias=Test Co.&destination_avatar=https://dev.leantech.me/success.png`;

      const initializationURL = lean.connect({
        customer_id: config.customerId,
        permissions: [
          'identity',
          'accounts',
          'balance',
          'transactions',
          'payments',
        ],
        access_token: 'test',
        access_to: '10-10-2023',
        access_from: '10-05-2023',
        end_user_id: '626715d7-222f-4087-bcce-2832135e4981',
        show_consent_explanation: true,
        bank_identifier: 'LEANMB1_SAU',
        fail_redirect_url: 'https://dev.leantech.me/fail',
        success_redirect_url: 'https://dev.leantech.me/success',
        payment_destination_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        destination_alias: 'Test Co.',
        destination_avatar: 'https://dev.leantech.me/success.png',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('reconnect', () => {
    it('partial params: returns the correct URL when called', () => {
      const expectedUrl = `${BASE_URL}&method=reconnect&reconnect_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0`;

      const initializationURL = lean.reconnect({
        reconnect_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL when called', () => {
      const expectedUrl = `${BASE_URL}&method=reconnect&reconnect_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&access_token=test&destination_alias=Test Co.&destination_avatar=https://dev.leantech.me/success.png`;

      const initializationURL = lean.reconnect({
        access_token: 'test',
        reconnect_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        destination_alias: 'Test Co.',
        destination_avatar: 'https://dev.leantech.me/success.png',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('createBeneficiary', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=createBeneficiary&customer_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0`;

      const initializationURL = lean.createBeneficiary({
        customer_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=createBeneficiary&customer_id=726715d7-222f-4087-bcce-2832135e4981&fail_redirect_url=https://dev.leantech.me/fail&success_redirect_url=https://dev.leantech.me/success&access_token=test&payment_source_id=8b3b7960-c4a1-41da-8ad0-5df36cf67540&payment_destination_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&entity_id=726715d7-222f-4087-bcce-2832135e4981&destination_alias=Test Co.&destination_avatar=https://dev.leantech.me/success.png`;

      const initializationURL = lean.createBeneficiary({
        access_token: 'test',
        entity_id: '726715d7-222f-4087-bcce-2832135e4981',
        customer_id: '726715d7-222f-4087-bcce-2832135e4981',
        fail_redirect_url: 'https://dev.leantech.me/fail',
        success_redirect_url: 'https://dev.leantech.me/success',
        payment_source_id: '8b3b7960-c4a1-41da-8ad0-5df36cf67540',
        payment_destination_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        destination_alias: 'Test Co.',
        destination_avatar: 'https://dev.leantech.me/success.png',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('createPaymentSource', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=createPaymentSource&customer_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0`;

      const initializationURL = lean.createPaymentSource({
        customer_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=createPaymentSource&customer_id=726715d7-222f-4087-bcce-2832135e4981&bank_identifier=LEANMB1_SAU&access_token=test&payment_destination_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&fail_redirect_url=https://dev.leantech.me/fail&success_redirect_url=https://dev.leantech.me/success&destination_alias=Test Co.&destination_avatar=https://dev.leantech.me/success.png`;

      const initializationURL = lean.createPaymentSource({
        access_token: 'test',
        bank_identifier: 'LEANMB1_SAU',
        customer_id: '726715d7-222f-4087-bcce-2832135e4981',
        fail_redirect_url: 'https://dev.leantech.me/fail',
        success_redirect_url: 'https://dev.leantech.me/success',
        payment_source_id: '8b3b7960-c4a1-41da-8ad0-5df36cf67540',
        payment_destination_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        destination_alias: 'Test Co.',
        destination_avatar: 'https://dev.leantech.me/success.png',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('updatePaymentSource', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=updatePaymentSource&customer_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0`;

      const initializationURL = lean.updatePaymentSource({
        customer_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=updatePaymentSource&customer_id=726715d7-222f-4087-bcce-2832135e4981&access_token=test&payment_destination_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&payment_source_id=8b3b7960-c4a1-41da-8ad0-5df36cf67540&end_user_id=626715d7-222f-4087-bcce-2832135e4981&entity_id=726715d7-222f-4087-bcce-2832135e4981&fail_redirect_url=https://dev.leantech.me/fail&success_redirect_url=https://dev.leantech.me/success&destination_alias=Test Co.&destination_avatar=https://dev.leantech.me/success.png`;

      const initializationURL = lean.updatePaymentSource({
        access_token: 'test',
        entity_id: '726715d7-222f-4087-bcce-2832135e4981',
        customer_id: '726715d7-222f-4087-bcce-2832135e4981',
        end_user_id: '626715d7-222f-4087-bcce-2832135e4981',
        fail_redirect_url: 'https://dev.leantech.me/fail',
        success_redirect_url: 'https://dev.leantech.me/success',
        payment_source_id: '8b3b7960-c4a1-41da-8ad0-5df36cf67540',
        payment_destination_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        destination_alias: 'Test Co.',
        destination_avatar: 'https://dev.leantech.me/success.png',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('pay', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=pay&payment_intent_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0`;

      const initializationURL = lean.pay({
        payment_intent_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=pay&payment_intent_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&access_token=test&account_id=8b3b7960-c4a1-41da-8ad0-5df36cf67540&end_user_id=626715d7-222f-4087-bcce-2832135e4981&show_balances=true&fail_redirect_url=https://dev.leantech.me/fail&success_redirect_url=https://dev.leantech.me/success&destination_alias=Test Co.&destination_avatar=https://dev.leantech.me/success.png`;

      const initializationURL = lean.pay({
        show_balances: true,
        access_token: 'test',
        account_id: '8b3b7960-c4a1-41da-8ad0-5df36cf67540',
        end_user_id: '626715d7-222f-4087-bcce-2832135e4981',
        payment_intent_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        fail_redirect_url: 'https://dev.leantech.me/fail',
        success_redirect_url: 'https://dev.leantech.me/success',
        destination_alias: 'Test Co.',
        destination_avatar: 'https://dev.leantech.me/success.png',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('authorizeConsent', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=authorizeConsent&customer_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&consent_id=7ebe7449-fd93-4657-be82-fcc3697262c4&fail_redirect_url=https://dev.leantech.me/fail&success_redirect_url=https://dev.leantech.me/success`;

      const initializationURL = lean.authorizeConsent({
        customer_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        consent_id: '7ebe7449-fd93-4657-be82-fcc3697262c4',
        fail_redirect_url: 'https://dev.leantech.me/fail',
        success_redirect_url: 'https://dev.leantech.me/success',
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=authorizeConsent&customer_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&consent_id=7ebe7449-fd93-4657-be82-fcc3697262c4&fail_redirect_url=https://dev.leantech.me/fail&success_redirect_url=https://dev.leantech.me/success&access_token=test&destination_alias=Test Co.&destination_avatar=https://dev.leantech.me/success.png`;

      const initializationURL = lean.authorizeConsent({
        customer_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        consent_id: '7ebe7449-fd93-4657-be82-fcc3697262c4',
        fail_redirect_url: 'https://dev.leantech.me/fail',
        success_redirect_url: 'https://dev.leantech.me/success',
        access_token: 'test',
        destination_alias: 'Test Co.',
        destination_avatar: 'https://dev.leantech.me/success.png',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('link with customization params', () => {
    const leanWithCustomization = new Lean({
      appToken: config.appToken,
      env: 'production',
      country: 'ae',
      language: 'en',
      isSandbox: false,
      showLogs: false,
      version: 'latest',
      customization: {
        dialog_mode: 'uncontained',
        theme_color: 'rgb(0,152,172)',
        button_text_color: 'white',
        button_border_radius: '15',
        link_color: 'rgb(0,152,172)',
        overlay_color: 'rgb(175,182,182)',
      },
    });

    it('customization: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=link&customer_id=dda80d32-4062-404c-abe7-ba9b9290c873&permissions=identity&permissions=accounts&permissions=balance&permissions=transactions&customization=dialog_mode+uncontained&customization=theme_color+rgb(0,152,172)&customization=button_text_color+white&customization=button_border_radius+15&customization=link_color+rgb(0,152,172)&customization=overlay_color+rgb(175,182,182)&bank_identifier=LEANMB1_SAU&fail_redirect_url=https://dev.leantech.me/fail&success_redirect_url=https://dev.leantech.me/success`;

      const initializationURL = leanWithCustomization.link({
        customer_id: config.customerId,
        permissions: ['identity', 'accounts', 'balance', 'transactions'],
        bank_identifier: 'LEANMB1_SAU',
        fail_redirect_url: 'https://dev.leantech.me/fail',
        success_redirect_url: 'https://dev.leantech.me/success',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('verifyAddress', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=verifyAddress&customer_id=test-customer-id&customer_name=test-customer-name&permissions=identity`;

      const initializationURL = lean.verifyAddress({
        customer_id: 'test-customer-id',
        customer_name: 'test-customer-name',
        permissions: ['identity'],
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=verifyAddress&customer_id=test-customer-id&customer_name=test-customer-name&permissions=identity&access_token=test-access-token&destination_alias=Test Co.&destination_avatar=https://dev.leantech.me/success.png`;

      const initializationURL = lean.verifyAddress({
        customer_id: 'test-customer-id',
        customer_name: 'test-customer-name',
        permissions: ['identity'],
        access_token: 'test-access-token',
        destination_alias: 'Test Co.',
        destination_avatar: 'https://dev.leantech.me/success.png',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('checkout', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=checkout&payment_intent_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0`;

      const initializationURL = lean.checkout({
        payment_intent_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=checkout&payment_intent_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&access_token=test&customer_name=John Doe&success_redirect_url=https://dev.leantech.me/success&fail_redirect_url=https://dev.leantech.me/fail`;

      const initializationURL = lean.checkout({
        customer_name: 'John Doe',
        payment_intent_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        access_token: 'test',
        success_redirect_url: 'https://dev.leantech.me/success',
        fail_redirect_url: 'https://dev.leantech.me/fail',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('manageConsents', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=manageConsents&customer_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0`;

      const initializationURL = lean.manageConsents({
        customer_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=manageConsents&customer_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&access_token=test`;

      const initializationURL = lean.manageConsents({
        customer_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        access_token: 'test',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });

  describe('captureRedirect', () => {
    it('partial params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=captureRedirect&customer_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&consent_attempt_id=7ebe7449-fd93-4657-be82-fcc3697262c4`;

      const initializationURL = lean.captureRedirect({
        customer_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        consent_attempt_id: '7ebe7449-fd93-4657-be82-fcc3697262c4',
      });

      expect(initializationURL).toBe(expectedUrl);
    });

    it('all params: returns the correct URL', () => {
      const expectedUrl = `${BASE_URL}&method=captureRedirect&customer_id=617207b3-a4d4-4413-ba1b-b8d32efd58a0&consent_attempt_id=7ebe7449-fd93-4657-be82-fcc3697262c4&access_token=test&granular_status_code=SUCCESS&status_additional_info=Additional information about the consent`;

      const initializationURL = lean.captureRedirect({
        customer_id: '617207b3-a4d4-4413-ba1b-b8d32efd58a0',
        consent_attempt_id: '7ebe7449-fd93-4657-be82-fcc3697262c4',
        access_token: 'test',
        granular_status_code: 'SUCCESS',
        status_additional_info: 'Additional information about the consent',
      });

      expect(initializationURL).toBe(expectedUrl);
    });
  });
});
