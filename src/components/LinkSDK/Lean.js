import {Platform} from 'react-native';
import {Config, Methods, Params} from './constants';
import Logger from './Logger';

const pkg = require('../../../package.json');

class Lean {
  constructor({
    env,
    version,
    country,
    appToken,
    language,
    showLogs,
    isSandbox,
    customization,
  }) {
    this.env = env;
    this.version = version;
    this.country = country;
    this.language = language;
    this.appToken = appToken;
    this.isSandbox = isSandbox;
    this.customization = customization;
    this.baseURL = `https://cdn.leantech.me/link/loader/prod/${this.country}/latest/lean-sdk.html`;

    Logger.showLogs = showLogs;
  }

  //  ================    Members and helper methods    ================    //

  get baseUrl() {
    return this.baseURL
      .concat(`?${Config.IMPLEMENTATION}=webview-hosted-html`)
      .concat(this.implementationParams)
      .concat(`&${Config.APP_TOKEN}=${this.appToken}`)
      .concat(`&${Config.SANDBOX}=${this.isSandbox}`)
      .concat(`&${Config.LANGUAGE}=${this.language}`)
      .concat(`&${Config.VERSION}=${this.version}`)
      .concat(`&${Config.COUNTRY}=${this.country}`)
      .concat(`&${Config.ENV}=${this.env}`);
  }

  get implementationParams() {
    const implementation = {
      platform: 'mobile',
      sdk: 'react_native',
      os: Platform.OS,
      sdk_version: pkg.version,
      is_version_pinned: this.version !== 'latest',
    };

    let implementationParams = '';

    for (const key in implementation) {
      implementationParams = implementationParams.concat(
        `&${Config.IMPLEMENTATION_CONFIG}=${key}+${implementation[key]}`,
      );
    }

    return implementationParams;
  }

  convertPermissionsToURLString(permissions) {
    let permissionsParams = '';

    if (!Array.isArray(permissions)) {
      return permissionsParams;
    }

    for (const permission of permissions) {
      permissionsParams = permissionsParams.concat(
        `&${Params.PERMISSIONS}=${permission}`,
      );
    }

    return permissionsParams;
  }

  convertCustomizationToURLString() {
    let customizationParams = '';

    if (this.customization && !Object.keys(this.customization).length) {
      return customizationParams;
    }

    for (const customizationOption in this.customization) {
      customizationParams = customizationParams.concat(
        `&${Params.CUSTOMIZATION}=${customizationOption}+${this.customization[customizationOption]}`,
      );
    }

    return customizationParams;
  }

  //  ================    Link methods    ================    //

  link({
    customer_id,
    permissions,
    bank_identifier,
    fail_redirect_url,
    success_redirect_url,
  }) {
    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.LINK}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(permissionsParams)
      .concat(customizationParams);

    // only include properties that are set
    if (bank_identifier) {
      initializationURL = initializationURL.concat(
        `&${Params.BANK_IDENTIFIER}=${bank_identifier}`,
      );
    }

    if (fail_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${fail_redirect_url}`,
      );
    }

    if (success_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${success_redirect_url}`,
      );
    }

    return initializationURL;
  }

  connect({
    access_to,
    access_from,
    permissions,
    customer_id,
    end_user_id,
    bank_identifier,
    fail_redirect_url,
    success_redirect_url,
    payment_destination_id,
    account_type,
  }) {
    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CONNECT}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(permissionsParams)
      .concat(customizationParams);

    // only include properties that are set
    if (bank_identifier) {
      initializationURL = initializationURL.concat(
        `&${Params.BANK_IDENTIFIER}=${bank_identifier}`,
      );
    }

    if (end_user_id) {
      initializationURL = initializationURL.concat(
        `&${Params.END_USER_ID}=${end_user_id}`,
      );
    }

    if (payment_destination_id) {
      initializationURL = initializationURL.concat(
        `&${Params.PAYMENT_DESTINATION_ID}=${payment_destination_id}`,
      );
    }

    if (access_to) {
      initializationURL = initializationURL.concat(
        `&${Params.ACCESS_TO}=${access_to}`,
      );
    }

    if (access_from) {
      initializationURL = initializationURL.concat(
        `&${Params.ACCESS_FROM}=${access_from}`,
      );
    }

    if (fail_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${fail_redirect_url}`,
      );
    }

    if (success_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${success_redirect_url}`,
      );
    }

    if (account_type) {
      initializationURL = initializationURL.concat(
        `&${Params.ACCOUNT_TYPE}=${account_type}`,
      );
    }

    return initializationURL;
  }

  reconnect({reconnect_id}) {
    const customizationParams = this.convertCustomizationToURLString();

    return this.baseUrl
      .concat(`&method=${Methods.RECONNECT}`)
      .concat(`&${Params.RECONNECT_ID}=${reconnect_id}`)
      .concat(customizationParams);
  }

  createBeneficiary({
    customer_id,
    payment_source_id,
    fail_redirect_url,
    success_redirect_url,
    payment_destination_id,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CREATE_BENEFICIARY}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(customizationParams);

    // only include properties that are set
    if (fail_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${fail_redirect_url}`,
      );
    }

    if (success_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${success_redirect_url}`,
      );
    }

    if (payment_source_id) {
      initializationURL = initializationURL.concat(
        `&${Params.PAYMENT_SOURCE_ID}=${payment_source_id}`,
      );
    }

    if (payment_destination_id) {
      initializationURL = initializationURL.concat(
        `&${Params.PAYMENT_DESTINATION_ID}=${payment_destination_id}`,
      );
    }

    return initializationURL;
  }

  createPaymentSource({
    customer_id,
    bank_identifier,
    fail_redirect_url,
    success_redirect_url,
    payment_destination_id,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CREATE_PAYMENT_SOURCE}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(customizationParams);

    // only include properties that are set
    if (bank_identifier) {
      initializationURL = initializationURL.concat(
        `&${Params.BANK_IDENTIFIER}=${bank_identifier}`,
      );
    }

    if (payment_destination_id) {
      initializationURL = initializationURL.concat(
        `&${Params.PAYMENT_DESTINATION_ID}=${payment_destination_id}`,
      );
    }

    if (fail_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${fail_redirect_url}`,
      );
    }

    if (success_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${success_redirect_url}`,
      );
    }

    return initializationURL;
  }

  updatePaymentSource({
    end_user_id,
    customer_id,
    payment_source_id,
    fail_redirect_url,
    success_redirect_url,
    payment_destination_id,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.UPDATE_PAYMENT_SOURCE}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(customizationParams);

    // only include properties that are set
    if (payment_destination_id) {
      initializationURL = initializationURL.concat(
        `&${Params.PAYMENT_DESTINATION_ID}=${payment_destination_id}`,
      );
    }

    if (payment_source_id) {
      initializationURL = initializationURL.concat(
        `&${Params.PAYMENT_SOURCE_ID}=${payment_source_id}`,
      );
    }

    if (end_user_id) {
      initializationURL = initializationURL.concat(
        `&${Params.END_USER_ID}=${end_user_id}`,
      );
    }

    if (fail_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${fail_redirect_url}`,
      );
    }

    if (success_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${success_redirect_url}`,
      );
    }

    return initializationURL;
  }

  pay({
    account_id,
    end_user_id,
    show_balances,
    fail_redirect_url,
    payment_intent_id,
    success_redirect_url,
    bulk_payment_intent_id,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.PAY}`)
      .concat(customizationParams);

    // only include properties that are set
    if (payment_intent_id) {
      initializationURL = initializationURL.concat(
        `&${Params.PAYMENT_INTENT_ID}=${payment_intent_id}`,
      );
    }

    if (bulk_payment_intent_id) {
      initializationURL = initializationURL.concat(
        `&${Params.BULK_PAYMENT_INTENT_ID}=${bulk_payment_intent_id}`,
      );
    }

    if (account_id) {
      initializationURL = initializationURL.concat(
        `&${Params.ACCOUNT_ID}=${account_id}`,
      );
    }

    if (end_user_id) {
      initializationURL = initializationURL.concat(
        `&${Params.END_USER_ID}=${end_user_id}`,
      );
    }

    if (show_balances) {
      initializationURL = initializationURL.concat(
        `&${Params.SHOW_BALANCES}=${show_balances}`,
      );
    }

    if (fail_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${fail_redirect_url}`,
      );
    }

    if (success_redirect_url) {
      initializationURL = initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${success_redirect_url}`,
      );
    }

    return initializationURL;
  }
}

export default Lean;
