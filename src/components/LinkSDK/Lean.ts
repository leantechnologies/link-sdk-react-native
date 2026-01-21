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

  private get baseUrl(): string {
    return this.baseURL
      .concat(`?${Config.IMPLEMENTATION}=webview-hosted-html`)
      .concat(this.implementationParams)
      .concat(`&${Config.APP_TOKEN}=${this.encodeURLParam(this.appToken)}`)
      .concat(`&${Config.SANDBOX}=${this.encodeURLParam(this.isSandbox)}`)
      .concat(`&${Config.LANGUAGE}=${this.encodeURLParam(this.language)}`)
      .concat(`&${Config.VERSION}=${this.encodeURLParam(this.version)}`)
      .concat(`&${Config.COUNTRY}=${this.encodeURLParam(this.country)}`)
      .concat(`&${Config.ENV}=${this.encodeURLParam(this.env)}`);
  }

  private get implementationParams(): string {
    const implementation: Record<string, string | boolean> = {
      platform: 'mobile',
      sdk: 'react_native',
      os: Platform.OS,
      sdk_version: pkg.version,
      is_version_pinned: this.version !== 'latest',
    };

    let implementationParams = '';

    for (const key in implementation) {
      implementationParams = implementationParams.concat(
        `&${Config.IMPLEMENTATION_CONFIG}=${this.encodeURLParam(
          key,
        )}+${this.encodeURLParam(implementation[key])}`,
      );
    }

    return implementationParams;
  }

  private convertPermissionsToURLString(permissions?: Array<LeanPermission>): string {
    let permissionsParams = '';

    if (!Array.isArray(permissions)) {
      return permissionsParams;
    }

    for (const permission of permissions) {
      permissionsParams = permissionsParams.concat(
        `&${Params.PERMISSIONS}=${this.encodeURLParam(permission)}`,
      );
    }

    return permissionsParams;
  }

  private convertCustomizationToURLString(): string {
    let customizationParams = '';

    if (this.customization && !Object.keys(this.customization).length) {
      return customizationParams;
    }

    for (const customizationOption in this.customization) {
      const value = this.customization[customizationOption];
      if (value !== undefined) {
        customizationParams = customizationParams.concat(
          `&${Params.CUSTOMIZATION}=${this.encodeURLParam(
            customizationOption,
          )}+${this.encodeURLParam(value)}`,
        );
      }
    }

    return customizationParams;
  }

  private appendOptionalConfigToURLParams(
    url: string,
    optionalParams: Record<string, unknown>,
  ): string {
    let result = url;
    for (const [key, value] of Object.entries(optionalParams)) {
      if (value != null) {
        result = result.concat(
          `&${key}=${this.encodeURLParam(value as string | number | boolean)}`,
        );
      }
    }
    return result;
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
    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.LINK)}`)
      .concat(`&${Params.CUSTOMER_ID}=${this.encodeURLParam(customer_id)}`)
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
  }: ConnectParams): string {
    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.CONNECT)}`)
      .concat(`&${Params.CUSTOMER_ID}=${this.encodeURLParam(customer_id)}`)
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
  }: ReconnectParams): string {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.RECONNECT)}`)
      .concat(`&${Params.RECONNECT_ID}=${this.encodeURLParam(reconnect_id)}`)
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
  }: CreateBeneficiaryParams): string {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.CREATE_BENEFICIARY)}`)
      .concat(`&${Params.CUSTOMER_ID}=${this.encodeURLParam(customer_id)}`)
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
  }: CreatePaymentSourceParams): string {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.CREATE_PAYMENT_SOURCE)}`)
      .concat(`&${Params.CUSTOMER_ID}=${this.encodeURLParam(customer_id)}`)
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
  }: UpdatePaymentSourceParams): string {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.UPDATE_PAYMENT_SOURCE)}`)
      .concat(`&${Params.CUSTOMER_ID}=${this.encodeURLParam(customer_id)}`)
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
  }: PayParams): string {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.PAY)}`)
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
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
      [Params.BANK_IDENTIFIER]: bank_identifier,
      [Params.RISK_DETAILS]: this.serializeRiskDetails(risk_details),
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
  }: VerifyAddressParams): string {
    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.VERIFY_ADDRESS)}`)
      .concat(`&${Params.CUSTOMER_ID}=${this.encodeURLParam(customer_id)}`)
      .concat(`&${Params.CUSTOMER_NAME}=${this.encodeURLParam(customer_name)}`)
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
  }: AuthorizeConsentParams): string {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.AUTHORIZE_CONSENT)}`)
      .concat(`&${Params.CUSTOMER_ID}=${this.encodeURLParam(customer_id)}`)
      .concat(`&${Params.CONSENT_ID}=${this.encodeURLParam(consent_id)}`)
      .concat(
        `&${Params.FAIL_REDIRECT_URL}=${this.encodeURLParam(
          fail_redirect_url,
        )}`,
      )
      .concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${this.encodeURLParam(
          success_redirect_url,
        )}`,
      )
      .concat(customizationParams);

    const optionalParams = {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.DESTINATION_ALIAS]: destination_alias,
      [Params.DESTINATION_AVATAR]: destination_avatar,
      [Params.RISK_DETAILS]: this.serializeRiskDetails(risk_details),
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
  }: CheckoutParams): string {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.CHECKOUT)}`)
      .concat(
        `&${Params.PAYMENT_INTENT_ID}=${this.encodeURLParam(
          payment_intent_id,
        )}`,
      )
      .concat(customizationParams);

    const optionalParams = {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.CUSTOMER_NAME]: customer_name,
      [Params.SUCCESS_REDIRECT_URL]: success_redirect_url,
      [Params.FAIL_REDIRECT_URL]: fail_redirect_url,
      [Params.BANK_IDENTIFIER]: bank_identifier,
      [Params.RISK_DETAILS]: this.serializeRiskDetails(risk_details),
    };

    return this.appendOptionalConfigToURLParams(
      initializationURL,
      optionalParams,
    );
  }

  manageConsents({customer_id, access_token}: ManageConsentsParams): string {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.MANAGE_CONSENTS)}`)
      .concat(`&${Params.CUSTOMER_ID}=${this.encodeURLParam(customer_id)}`)
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
    consent_id,
    granular_status_code,
    status_additional_info,
  }: CaptureRedirectParams): string {
    const customizationParams = this.convertCustomizationToURLString();

    let initializationURL = this.baseUrl
      .concat(`&method=${this.encodeURLParam(Methods.CAPTURE_REDIRECT)}`)
      .concat(`&${Params.CUSTOMER_ID}=${this.encodeURLParam(customer_id)}`)
      .concat(
        `&${Params.CONSENT_ATTEMPT_ID}=${this.encodeURLParam(
          consent_attempt_id,
        )}`,
      )
      .concat(customizationParams);

    const optionalParams = {
      [Params.ACCESS_TOKEN]: access_token,
      [Params.CONSENT_ID]: consent_id,
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
