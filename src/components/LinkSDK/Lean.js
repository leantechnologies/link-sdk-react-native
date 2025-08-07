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
    access_token,
  }) {
    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.LINK}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(permissionsParams)
      .concat(customizationParams);

    const optionalParams = {
      [Params.BANK_IDENTIFIER]: bank_identifier,
      [Params.ACCESS_TOKEN]: access_token,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
    };

    for (const [key, value] of Object.entries(optionalParams)) {
      if (value) {
        initializationURL = initializationURL.concat(`&${key}=${value}`);
      }
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
    show_consent_explanation,
    account_type,
    access_token,
  }) {
    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CONNECT}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(permissionsParams)
      .concat(customizationParams);

    const optionalParams = {
      [Params.BANK_IDENTIFIER]: bank_identifier,
      [Params.END_USER_ID]: end_user_id,
      [Params.PAYMENT_DESTINATION_ID]: payment_destination_id,
      [Params.ACCESS_TOKEN]: access_token,
      [Params.ACCESS_TO]: access_to,
      [Params.ACCESS_FROM]: access_from,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
      [Params.ACCOUNT_TYPE]: account_type,
      [Params.SHOW_CONSENT_EXPLANATION]: show_consent_explanation,
    };

    for (const [key, value] of Object.entries(optionalParams)) {
      if (value) {
        initializationURL = initializationURL.concat(`&${key}=${value}`);
      }
    }

    return initializationURL;
  }

  reconnect({reconnect_id, access_token}) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.RECONNECT}`)
      .concat(`&${Params.RECONNECT_ID}=${reconnect_id}`)
      .concat(customizationParams);

    if (access_token) {
      initializationURL = initializationURL.concat(
        `&${Params.ACCESS_TOKEN}=${access_token}`,
      );
    }

    return initializationURL;
  }

  createBeneficiary({
    customer_id,
    payment_source_id,
    fail_redirect_url,
    success_redirect_url,
    payment_destination_id,
    access_token,
    entity_id,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CREATE_BENEFICIARY}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(customizationParams);

    const optionalParams = {
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
      [Params.ACCESS_TOKEN]: access_token,
      [Params.PAYMENT_SOURCE_ID]: payment_source_id,
      [Params.PAYMENT_DESTINATION_ID]: payment_destination_id,
      [Params.ENTITY_ID]: entity_id,
    };

    for (const [key, value] of Object.entries(optionalParams)) {
      if (value) {
        initializationURL = initializationURL.concat(`&${key}=${value}`);
      }
    }

    return initializationURL;
  }

  createPaymentSource({
    customer_id,
    bank_identifier,
    fail_redirect_url,
    success_redirect_url,
    payment_destination_id,
    access_token,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CREATE_PAYMENT_SOURCE}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(customizationParams);

    const optionalParams = {
      [Params.BANK_IDENTIFIER]: bank_identifier,
      [Params.ACCESS_TOKEN]: access_token,
      [Params.PAYMENT_DESTINATION_ID]: payment_destination_id,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
    };

    for (const [key, value] of Object.entries(optionalParams)) {
      if (value) {
        initializationURL = initializationURL.concat(`&${key}=${value}`);
      }
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
    access_token,
    entity_id,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.UPDATE_PAYMENT_SOURCE}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(customizationParams);

    const optionalParams = {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.PAYMENT_DESTINATION_ID]: payment_destination_id,
      [Params.PAYMENT_SOURCE_ID]: payment_source_id,
      [Params.END_USER_ID]: end_user_id,
      [Params.ENTITY_ID]: entity_id,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
    };

    for (const [key, value] of Object.entries(optionalParams)) {
      if (value) {
        initializationURL = initializationURL.concat(`&${key}=${value}`);
      }
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
    access_token,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.PAY}`)
      .concat(customizationParams);

    const optionalParams = {
      [Params.PAYMENT_INTENT_ID]: payment_intent_id,
      [Params.BULK_PAYMENT_INTENT_ID]: bulk_payment_intent_id,
      [Params.ACCESS_TOKEN]: access_token,
      [Params.ACCOUNT_ID]: account_id,
      [Params.END_USER_ID]: end_user_id,
      [Params.SHOW_BALANCES]: show_balances,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
    };

    for (const [key, value] of Object.entries(optionalParams)) {
      if (value) {
        initializationURL = initializationURL.concat(`&${key}=${value}`);
      }
    }

    return initializationURL;
  }

  verifyAddress({permissions, customer_id, customer_name, access_token}) {
    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.VERIFY_ADDRESS}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(`&${Params.CUSTOMER_NAME}=${customer_name}`)
      .concat(permissionsParams)
      .concat(customizationParams);

    // only include properties that are set
    if (access_token) {
      initializationURL = initializationURL.concat(
        `&${Params.ACCESS_TOKEN}=${access_token}`,
      );
    }

    return initializationURL;
  }
}

export default Lean;
