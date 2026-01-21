import {Platform} from 'react-native';
import Logger from './Logger';
import {CustomizationOptions} from '../../types/sdk';
import {RiskDetails} from '../../types/risk-details';
import {
  LinkParams,
  ConnectParams,
  ReconnectParams,
  CreateBeneficiaryParams,
  CreatePaymentSourceParams,
  UpdatePaymentSourceParams,
  PayParams,
  VerifyAddressParams,
  AuthorizeConsentParams,
  CheckoutParams,
  ManageConsentsParams,
  CaptureRedirectParams,
} from '../../types/methods';
import { LeanPermission } from '../../types';
import pkg from '../../../package.json';

// Internal constants (not exported)
const Config = {
  ENV: 'env',
  SANDBOX: 'sandbox',
  VERSION: 'version',
  COUNTRY: 'country',
  LANGUAGE: 'language',
  APP_TOKEN: 'app_token',
  SHOW_LOGS: 'show_logs',
  IMPLEMENTATION: 'implementation',
  IMPLEMENTATION_CONFIG: 'implementation_config',
};

const Params = {
  INITIALIZATION_URL: 'initialization_url',
  PAYMENT_INTENT_ID: 'payment_intent_id',
  PAYMENT_INTENT_IDS: 'payment_intent_ids',
  BULK_PAYMENT_INTENT_ID: 'bulk_payment_intent_id',
  SHOW_BALANCES: 'show_balances',
  RECONNECT_ID: 'reconnect_id',
  CUSTOMER_ID: 'customer_id',
  CUSTOMER_NAME: 'customer_name',
  BANK_IDENTIFIER: 'bank_identifier',
  ACCOUNT_ID: 'account_id',
  PERMISSIONS: 'permissions',
  PAYMENT_SOURCE_ID: 'payment_source_id',
  PAYMENT_DESTINATION_ID: 'payment_destination_id',
  CUSTOMIZATION: 'customization',
  FAIL_REDIRECT_URL: 'fail_redirect_url',
  SUCCESS_REDIRECT_URL: 'success_redirect_url',
  ACCESS_TO: 'access_to',
  ACCESS_FROM: 'access_from',
  ACCOUNT_TYPE: 'account_type',
  END_USER_ID: 'end_user_id',
  ENTITY_ID: 'entity_id',
  ACCESS_TOKEN: 'access_token',
  SHOW_CONSENT_EXPLANATION: 'show_consent_explanation',
  DESTINATION_ALIAS: 'destination_alias',
  DESTINATION_AVATAR: 'destination_avatar',
  CONSENT_ID: 'consent_id',
  CONSENT_ATTEMPT_ID: 'consent_attempt_id',
  GRANULAR_STATUS_CODE: 'granular_status_code',
  STATUS_ADDITIONAL_INFO: 'status_additional_info',
  CUSTOMER_METADATA: 'customer_metadata',
  RISK_DETAILS: 'risk_details',
};

export const Methods = {
  PAY: 'pay',
  LINK: 'link',
  CONNECT: 'connect',
  RECONNECT: 'reconnect',
  CREATE_BENEFICIARY: 'createBeneficiary',
  CREATE_PAYMENT_SOURCE: 'createPaymentSource',
  UPDATE_PAYMENT_SOURCE: 'updatePaymentSource',
  VERIFY_ADDRESS: 'verifyAddress',
  AUTHORIZE_CONSENT: 'authorizeConsent',
  CHECKOUT: 'checkout',
  MANAGE_CONSENTS: 'manageConsents',
  CAPTURE_REDIRECT: 'captureRedirect',
} as const;

interface LeanConstructorParams {
  env: string;
  version: string;
  country: string;
  appToken: string;
  language: string;
  showLogs: boolean;
  isSandbox: boolean;
  customization: CustomizationOptions | null;
}

class Lean {
  private env: string;
  private version: string;
  private country: string;
  private language: string;
  private appToken: string;
  private isSandbox: boolean;
  private customization: CustomizationOptions | null;
  private baseURL: string;

  constructor({
    env,
    version,
    country,
    appToken,
    language,
    showLogs,
    isSandbox,
    customization,
  }: LeanConstructorParams) {
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

  private encodeURLParam(value: string | number | boolean): string {
    return encodeURIComponent(String(value));
  }

  private getImplementationConfigString(): string {
    const implementation: Record<string, string | boolean> = {
      platform: 'mobile',
      sdk: 'react_native',
      os: Platform.OS,
      sdk_version: pkg.version,
      is_version_pinned: this.version !== 'latest',
    };

    // Custom format: implementation_config=key+value with literal '+'
    let result = '';
    for (const key in implementation) {
      const encodedKey = this.encodeURLParam(key);
      const encodedValue = this.encodeURLParam(implementation[key]);
      result += `&${Config.IMPLEMENTATION_CONFIG}=${encodedKey}+${encodedValue}`;
    }
    return result;
  }

  private getCustomizationString(): string {
    if (!this.customization || !Object.keys(this.customization).length) {
      return '';
    }

    // Custom format: customization=key+value with literal '+'
    let result = '';
    for (const customizationOption in this.customization) {
      const value = this.customization[customizationOption];
      if (value !== undefined) {
        const encodedKey = this.encodeURLParam(customizationOption);
        const encodedValue = this.encodeURLParam(value);
        result += `&${Params.CUSTOMIZATION}=${encodedKey}+${encodedValue}`;
      }
    }
    return result;
  }

  private appendPermissions(
    params: URLSearchParams,
    permissions?: Array<LeanPermission>,
  ): void {
    if (!Array.isArray(permissions)) {
      return;
    }

    // URLSearchParams naturally handles repeated keys for arrays
    for (const permission of permissions) {
      params.append(Params.PERMISSIONS, permission);
    }
  }

  private appendOptionalParams(
    params: URLSearchParams,
    optionalParams: Record<string, unknown>,
  ): void {
    for (const [key, value] of Object.entries(optionalParams)) {
      if (value != null) {
        params.append(key, String(value));
      }
    }
  }

  private toURLString(params: URLSearchParams): string {
    // URLSearchParams.toString() encodes spaces as '+' but we need '%20'
    return params.toString().replace(/\+/g, '%20');
  }

  private get baseUrl(): string {
    // Build URL manually to maintain exact parameter order
    let url = `${this.baseURL}?${Config.IMPLEMENTATION}=${this.encodeURLParam('webview-hosted-html')}`;

    // Add implementation_config with literal '+'
    url += this.getImplementationConfigString();

    // Add standard params using URLSearchParams for proper encoding
    const params = new URLSearchParams();
    params.append(Config.APP_TOKEN, this.appToken);
    params.append(Config.SANDBOX, String(this.isSandbox));
    params.append(Config.LANGUAGE, this.language);
    params.append(Config.VERSION, this.version);
    params.append(Config.COUNTRY, this.country);
    params.append(Config.ENV, this.env);

    url += `&${this.toURLString(params)}`;

    return url;
  }

  private cleanJSONObject(obj: unknown): unknown {
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
      const cleaned: Record<string, unknown> = {};
      let hasValues = false;

      for (const [key, value] of Object.entries(
        obj as Record<string, unknown>,
      )) {
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

  private serializeRiskDetails(riskDetails?: RiskDetails): string | null {
    if (!riskDetails) {
      return null;
    }

    try {
      const cleanedDetails = this.cleanJSONObject(riskDetails);

      if (!cleanedDetails) {
        return null;
      }

      return JSON.stringify(cleanedDetails);
    } catch {
      return null;
    }
  }

  //  ================    Link methods    ================    //

  link({
    customer_id,
    permissions,
    bank_identifier,
    fail_redirect_url,
    success_redirect_url,
    access_token,
  }: LinkParams): string {
    let url = this.baseUrl;

    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.LINK);
    methodParams.append(Params.CUSTOMER_ID, customer_id);

    // Add permissions array
    this.appendPermissions(methodParams, permissions);

    url += `&${this.toURLString(methodParams)}`;

    // Add customization (literal '+' format) before optional params
    url += this.getCustomizationString();

    // Add optional params
    const optionalParams = new URLSearchParams();
    this.appendOptionalParams(optionalParams, {
      [Params.BANK_IDENTIFIER]: bank_identifier,
      [Params.ACCESS_TOKEN]: access_token,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
    });

    if (optionalParams.toString()) {
      url += `&${this.toURLString(optionalParams)}`;
    }

    return url;
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
  }: ConnectParams): string {
    let url = this.baseUrl;

    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.CONNECT);
    methodParams.append(Params.CUSTOMER_ID, customer_id);

    // Add permissions array
    this.appendPermissions(methodParams, permissions);

    // Add optional params
    this.appendOptionalParams(methodParams, {
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
    });

    url += `&${this.toURLString(methodParams)}`;
    url += this.getCustomizationString();

    return url;
  }

  reconnect({
    reconnect_id,
    access_token,
    destination_alias,
    destination_avatar,
  }: ReconnectParams): string {
    // Start with baseUrl which has proper param order
    let url = this.baseUrl;

    // Add method-specific params
    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.RECONNECT);
    methodParams.append(Params.RECONNECT_ID, reconnect_id);

    // Add optional params
    this.appendOptionalParams(methodParams, {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    });

    url += `&${this.toURLString(methodParams)}`;

    // Add customization (literal '+' format)
    const customizationString = this.getCustomizationString();
    url += customizationString;

    return url;
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
  }: CreateBeneficiaryParams): string {
    let url = this.baseUrl;

    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.CREATE_BENEFICIARY);
    methodParams.append(Params.CUSTOMER_ID, customer_id);

    this.appendOptionalParams(methodParams, {
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
      [Params.ACCESS_TOKEN]: access_token,
      [Params.PAYMENT_SOURCE_ID]: payment_source_id,
      [Params.PAYMENT_DESTINATION_ID]: payment_destination_id,
      [Params.ENTITY_ID]: entity_id,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    });

    url += `&${this.toURLString(methodParams)}`;
    url += this.getCustomizationString();

    return url;
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
  }: CreatePaymentSourceParams): string {
    let url = this.baseUrl;

    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.CREATE_PAYMENT_SOURCE);
    methodParams.append(Params.CUSTOMER_ID, customer_id);

    this.appendOptionalParams(methodParams, {
      [Params.BANK_IDENTIFIER]: bank_identifier,
      [Params.ACCESS_TOKEN]: access_token,
      [Params.PAYMENT_DESTINATION_ID]: payment_destination_id,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    });

    url += `&${this.toURLString(methodParams)}`;
    url += this.getCustomizationString();

    return url;
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
  }: UpdatePaymentSourceParams): string {
    let url = this.baseUrl;

    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.UPDATE_PAYMENT_SOURCE);
    methodParams.append(Params.CUSTOMER_ID, customer_id);

    this.appendOptionalParams(methodParams, {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.PAYMENT_DESTINATION_ID]: payment_destination_id,
      [Params.PAYMENT_SOURCE_ID]: payment_source_id,
      [Params.END_USER_ID]: end_user_id,
      [Params.ENTITY_ID]: entity_id,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    });

    url += `&${this.toURLString(methodParams)}`;
    url += this.getCustomizationString();

    return url;
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
  }: PayParams): string {
    let url = this.baseUrl;

    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.PAY);

    this.appendOptionalParams(methodParams, {
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
      [Params.RISK_DETAILS]: this.serializeRiskDetails(risk_details),
    });

    url += `&${this.toURLString(methodParams)}`;
    url += this.getCustomizationString();

    return url;
  }

  verifyAddress({
    permissions,
    customer_id,
    customer_name,
    access_token,
    destination_alias,
    destination_avatar,
  }: VerifyAddressParams): string {
    let url = this.baseUrl;

    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.VERIFY_ADDRESS);
    methodParams.append(Params.CUSTOMER_ID, customer_id);
    methodParams.append(Params.CUSTOMER_NAME, customer_name);

    // Add permissions array
    this.appendPermissions(methodParams, permissions);

    // Add optional params
    this.appendOptionalParams(methodParams, {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
    });

    url += `&${this.toURLString(methodParams)}`;
    url += this.getCustomizationString();

    return url;
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
  }: AuthorizeConsentParams): string {
    let url = this.baseUrl;

    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.AUTHORIZE_CONSENT);
    methodParams.append(Params.CUSTOMER_ID, customer_id);
    methodParams.append(Params.CONSENT_ID, consent_id);
    methodParams.append(Params.FAIL_REDIRECT_URL, fail_redirect_url);
    methodParams.append(Params.SUCCESS_REDIRECT_URL, success_redirect_url);

    // Add optional params
    this.appendOptionalParams(methodParams, {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
      [Params.RISK_DETAILS]: this.serializeRiskDetails(risk_details),
    });

    url += `&${this.toURLString(methodParams)}`;
    url += this.getCustomizationString();

    return url;
  }

  checkout({
    payment_intent_id,
    access_token,
    customer_name,
    bank_identifier,
    success_redirect_url,
    fail_redirect_url,
    risk_details,
  }: CheckoutParams): string {
    let url = this.baseUrl;

    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.CHECKOUT);
    methodParams.append(Params.PAYMENT_INTENT_ID, payment_intent_id);

    // Add optional params
    this.appendOptionalParams(methodParams, {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.CUSTOMER_NAME]: customer_name,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.BANK_IDENTIFIER]: bank_identifier,
      [Params.RISK_DETAILS]: this.serializeRiskDetails(risk_details),
    });

    url += `&${this.toURLString(methodParams)}`;
    url += this.getCustomizationString();

    return url;
  }

  manageConsents({customer_id, access_token}: ManageConsentsParams): string {
    // Start with baseUrl which has proper param order
    let url = this.baseUrl;

    // Add method-specific params
    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.MANAGE_CONSENTS);
    methodParams.append(Params.CUSTOMER_ID, customer_id);

    // Add optional params
    this.appendOptionalParams(methodParams, {
      [Params.ACCESS_TOKEN]: access_token,
    });

    url += `&${this.toURLString(methodParams)}`;

    // Add customization (literal '+' format)
    const customizationString = this.getCustomizationString();
    url += customizationString;

    return url;
  }

  captureRedirect({
    access_token,
    customer_id,
    consent_attempt_id,
    consent_id,
    granular_status_code,
    status_additional_info,
  }: CaptureRedirectParams): string {
    // Start with baseUrl which has proper param order
    let url = this.baseUrl;

    // Add method-specific params
    const methodParams = new URLSearchParams();
    methodParams.append('method', Methods.CAPTURE_REDIRECT);
    methodParams.append(Params.CUSTOMER_ID, customer_id);

    // Add optional params
    this.appendOptionalParams(methodParams, {
      [Params.CONSENT_ATTEMPT_ID]: consent_attempt_id,
      [Params.ACCESS_TOKEN]: access_token,
      [Params.CONSENT_ID]: consent_id,
      [Params.GRANULAR_STATUS_CODE]: granular_status_code,
      [Params.STATUS_ADDITIONAL_INFO]: status_additional_info,
    });

    url += `&${this.toURLString(methodParams)}`;

    // Add customization (literal '+' format)
    const customizationString = this.getCustomizationString();
    url += customizationString;

    return url;
  }
}

export default Lean;
