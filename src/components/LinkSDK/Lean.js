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

  appendOptionalConfigToURLParams(url, optionalParams) {
    let result = url;
    for (const [key, value] of Object.entries(optionalParams)) {
      if (value) {
        result = result.concat(`&${key}=${value}`);
      }
    }
    return result;
  }

  cleanJSONObject(obj) {
    if (obj === null || obj === undefined) {
      return null;
    }

    if (Array.isArray(obj)) {
      const cleaned = obj
        .map(item => this.cleanJSONObject(item))
        .filter(item => item !== null && item !== undefined);
      return cleaned.length > 0 ? cleaned : null;
    }

    if (Object.prototype.toString.call(obj) === '[object Object]') {
      const cleaned = {};
      let hasValues = false;

      for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = this.cleanJSONObject(value);

        if (cleanedValue !== null && cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
          hasValues = true;
        }
      }

      return hasValues ? cleaned : null;
    }

    return obj;
  }

  serializeRiskDetails(riskDetails) {
    if (!riskDetails) {
      return null;
    }

    try {
      const cleanedDetails = this.cleanJSONObject(riskDetails);

      if (!cleanedDetails) {
        return null;
      }

      const jsonString = JSON.stringify(cleanedDetails);
      return encodeURIComponent(jsonString);
    } catch (error) {
      return null;
    }
  }

  addRiskDetailsToURL(url, riskDetails) {
    if (!riskDetails) {
      return url;
    }

    const serializedRiskDetails = this.serializeRiskDetails(riskDetails);
    if (!serializedRiskDetails) {
      return url;
    }

    return url.concat(`&${Params.RISK_DETAILS}=${serializedRiskDetails}`);
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

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
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
    customer_metadata,
    access_token,
    destination_alias,
    destination_avatar,
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
      [Params.CUSTOMER_METADATA]: customer_metadata,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
  }

  reconnect({
    reconnect_id,
    access_token,
    destination_alias,
    destination_avatar,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.RECONNECT}`)
      .concat(`&${Params.RECONNECT_ID}=${reconnect_id}`)
      .concat(customizationParams);

    const optionalParams = {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
  }

  createBeneficiary({
    customer_id,
    payment_source_id,
    fail_redirect_url,
    success_redirect_url,
    payment_destination_id,
    access_token,
    entity_id,
    destination_alias,
    destination_avatar,
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
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
  }

  createPaymentSource({
    customer_id,
    bank_identifier,
    fail_redirect_url,
    success_redirect_url,
    payment_destination_id,
    access_token,
    destination_alias,
    destination_avatar,
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
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
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
    destination_alias,
    destination_avatar,
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
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
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
    destination_alias,
    destination_avatar,
    risk_details,
    bank_identifier,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.PAY}`)
      .concat(customizationParams);

    initializationURL = this.addRiskDetailsToURL(
      initializationURL,
      risk_details,
    );

    const optionalParams = {
      [Params.PAYMENT_INTENT_ID]: payment_intent_id,
      [Params.BULK_PAYMENT_INTENT_ID]: bulk_payment_intent_id,
      [Params.ACCESS_TOKEN]: access_token,
      [Params.ACCOUNT_ID]: account_id,
      [Params.END_USER_ID]: end_user_id,
      [Params.SHOW_BALANCES]: show_balances,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
      [Params.BANK_IDENTIFIER]: bank_identifier,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
  }

  verifyAddress({
    permissions,
    customer_id,
    customer_name,
    access_token,
    destination_alias,
    destination_avatar,
  }) {
    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.VERIFY_ADDRESS}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(`&${Params.CUSTOMER_NAME}=${customer_name}`)
      .concat(permissionsParams)
      .concat(customizationParams);

    const optionalParams = {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
  }

  authorizeConsent({
    customer_id,
    consent_id,
    fail_redirect_url,
    success_redirect_url,
    access_token,
    destination_alias,
    destination_avatar,
    risk_details,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.AUTHORIZE_CONSENT}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(`&${Params.CONSENT_ID}=${consent_id}`)
      .concat(`&${Params.FAIL_REDIRECT_URL}=${fail_redirect_url}`)
      .concat(`&${Params.SUCCESS_REDIRECT_URL}=${success_redirect_url}`)
      .concat(customizationParams);

    initializationURL = this.addRiskDetailsToURL(
      initializationURL,
      risk_details,
    );

    const optionalParams = {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
  }

  checkout({
    payment_intent_id,
    access_token,
    customer_name,
    bank_identifier,
    success_redirect_url,
    fail_redirect_url,
    risk_details,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CHECKOUT}`)
      .concat(`&${Params.PAYMENT_INTENT_ID}=${payment_intent_id}`)
      .concat(customizationParams);

    initializationURL = this.addRiskDetailsToURL(
      initializationURL,
      risk_details,
    );

    const optionalParams = {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.CUSTOMER_NAME]: customer_name,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.BANK_IDENTIFIER]: bank_identifier,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
  }

  manageConsents({customer_id, access_token}) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.MANAGE_CONSENTS}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(customizationParams);

    const optionalParams = {
      [Params.ACCESS_TOKEN]: access_token,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
  }

  captureRedirect({
    access_token,
    customer_id,
    consent_attempt_id,
    granular_status_code,
    status_additional_info,
  }) {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CAPTURE_REDIRECT}`)
      .concat(`&${Params.CUSTOMER_ID}=${customer_id}`)
      .concat(`&${Params.CONSENT_ATTEMPT_ID}=${consent_attempt_id}`)
      .concat(customizationParams);

    const optionalParams = {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.GRANULAR_STATUS_CODE]: granular_status_code,
      [Params.STATUS_ADDITIONAL_INFO]: status_additional_info,
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
  }
}

export default Lean;
