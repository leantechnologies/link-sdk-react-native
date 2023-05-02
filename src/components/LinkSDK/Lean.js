import {Config, Methods, Params, UserPermissions} from './constants';
import Logger from './Logger';

class Lean {
  constructor({
    appToken,
    isSandbox,
    version,
    country,
    language,
    showLogs,
    env,
  }) {
    this.appToken = appToken;
    this.isSandbox = isSandbox;
    this.version = version;
    this.country = country;
    this.language = language;
    this.env = env;

    Logger.showLogs = showLogs;
  }

  //  ================    Members and helper methods    ================    //

  baseURL = 'https://lean-loader-test.s3.amazonaws.com/lean-sdk.html';

  // Prod URL "https://cdn.leantech.me/link/loader/prod/$country/$version/lean-sdk.html"

  get baseUrl() {
    return this.baseURL
      .concat(`?${Config.IMPLEMENTATION}=webview-hosted-html`)
      .concat(`&${Config.APP_TOKEN}=${this.appToken}`)
      .concat(`&${Config.SANDBOX}=${this.isSandbox}`)
      .concat(`&${Config.LANGUAGE}=${this.language}`)
      .concat(`&${Config.VERSION}=${this.version}`)
      .concat(`&${Config.COUNTRY}=${this.country}`)
      .concat(`&${Config.ENV}=${this.env}`);
  }

  convertPermissionsToURLString(permissions) {
    let permissionsParams = '';

    if (!Array.isArray(permissions)) {
      return permissionsParams;
    }

    for (const permission of permissions) {
      permissionsParams.concat(`&${Params.PERMISSIONS}=${permission}`);
    }

    return permissionsParams;
  }

  convertCustomizationToURLString(customization) {
    let customizationParams = '';

    if (!Object.keys(customization).length) {
      return customizationParams;
    }

    for (const customizationOption in customization) {
      customizationParams.concat(
        `&${Params.CUSTOMIZATION}=${customizationOption}+${customization[customizationOption]}`,
      );
    }

    return customizationParams;
  }

  //  ================    Link methods    ================    //

  link({
    customerId,
    bankIdentifier,
    permissions,
    customization,
    failRedirectUrl,
    successRedirectUrl,
  }) {
    if (!customerId) {
      throw new Error('Validation Error: customerId is required');
    }

    if (!Array.isArray(permissions) || !permissions?.length) {
      throw new Error('Validation Error: permissions is required');
    }

    if (permissions.includes(UserPermissions.PAYMENTS)) {
      throw new Error(
        "Validation Error: 'payments' permission is not supported for link",
      );
    }

    if (
      (permissions.includes(UserPermissions.BALANCE) ||
        permissions.includes(UserPermissions.TRANSACTIONS)) &&
      !permissions.includes(UserPermissions.ACCOUNTS)
    ) {
      throw new Error(
        "Validation Error: Must have 'accounts' permission if requesting 'balance' and/or 'transactions' permission",
      );
    }

    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString(
      customization,
    );

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.LINK}`)
      .concat(`&${Params.CUSTOMER_ID}=${customerId}`)
      .concat(permissionsParams)
      .concat(customizationParams);

    // only include properties that are set
    if (bankIdentifier) {
      initializationURL.concat(`&${Params.BANK_IDENTIFIER}=${bankIdentifier}`);
    }

    if (failRedirectUrl) {
      initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${failRedirectUrl}`,
      );
    }

    if (successRedirectUrl) {
      initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${successRedirectUrl}`,
      );
    }

    return initializationURL;
  }

  connect({
    customerId,
    bankIdentifier,
    paymentDestinationId,
    permissions,
    customization,
    accessTo,
    accessFrom,
    failRedirectUrl,
    successRedirectUrl,
  }) {
    if (!customerId) {
      throw new Error('Validation Error: customerId is required');
    }

    if (!permissions) {
      throw new Error('Validation Error: permissions is required');
    }

    if (
      (permissions.includes(UserPermissions.BALANCE) ||
        permissions.includes(UserPermissions.TRANSACTIONS)) &&
      !permissions.includes(UserPermissions.ACCOUNTS)
    ) {
      throw new Error(
        "Validation Error: Must have 'accounts' permission if requesting 'balance' and/or 'transactions' permission",
      );
    }

    const permissionsParams = this.convertPermissionsToURLString(permissions);
    const customizationParams = this.convertCustomizationToURLString(
      customization,
    );

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CONNECT}`)
      .concat(`&${Params.CUSTOMER_ID}=${customerId}`)
      .concat(permissionsParams)
      .concat(customizationParams);

    // only include properties that are set
    if (bankIdentifier) {
      initializationURL.concat(`&${Params.BANK_IDENTIFIER}=${bankIdentifier}`);
    }

    if (paymentDestinationId) {
      initializationURL.concat(
        `&${Params.PAYMENT_DESTINATION_ID}=${paymentDestinationId}`,
      );
    }

    if (accessTo) {
      initializationURL.concat(`&${Params.ACCESS_TO}=${accessTo}`);
    }

    if (accessFrom) {
      initializationURL.concat(`&${Params.ACCESS_FROM}=${accessFrom}`);
    }

    if (failRedirectUrl) {
      initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${failRedirectUrl}`,
      );
    }

    if (successRedirectUrl) {
      initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${successRedirectUrl}`,
      );
    }

    return initializationURL;
  }

  reconnect({reconnectId, customization}) {
    if (!reconnectId) {
      throw new Error('Validation Error: reconnectId is required');
    }

    const customizationParams = this.convertCustomizationToURLString(
      customization,
    );

    return this.baseUrl
      .concat(`&method=${Methods.RECONNECT}`)
      .concat(`&${Params.RECONNECT_ID}=${reconnectId}`)
      .concat(customizationParams);
  }

  createBeneficiary({
    customerId,
    paymentSourceId,
    paymentDestinationId,
    customization,
    failRedirectUrl,
    successRedirectUrl,
  }) {
    if (!customerId) {
      throw new Error('Validation Error: customerId is required');
    }

    const customizationParams = this.convertCustomizationToURLString(
      customization,
    );

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CREATE_BENEFICIARY}`)
      .concat(`&${Params.CUSTOMER_ID}=${customerId}`)
      .concat(customizationParams);

    if (paymentSourceId) {
      initializationURL.concat(
        `&${Params.PAYMENT_SOURCE_ID}=${paymentSourceId}`,
      );
    }

    if (paymentDestinationId) {
      initializationURL.concat(
        `&${Params.PAYMENT_DESTINATION_ID}=${paymentDestinationId}`,
      );
    }

    if (failRedirectUrl) {
      initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${failRedirectUrl}`,
      );
    }

    if (successRedirectUrl) {
      initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${successRedirectUrl}`,
      );
    }

    return initializationURL;
  }

  createPaymentSource({
    customerId,
    bankIdentifier,
    paymentDestinationId,
    customization,
    failRedirectUrl,
    successRedirectUrl,
  }) {
    if (!customerId) {
      throw new Error('Validation Error: customerId is required');
    }

    const customizationParams = this.convertCustomizationToURLString(
      customization,
    );

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.CREATE_PAYMENT_SOURCE}`)
      .concat(`&${Params.CUSTOMER_ID}=${customerId}`)
      .concat(customizationParams);

    if (bankIdentifier) {
      initializationURL.concat(`&${Params.BANK_IDENTIFIER}=${bankIdentifier}`);
    }

    if (paymentDestinationId) {
      initializationURL.concat(
        `&${Params.PAYMENT_DESTINATION_ID}=${paymentDestinationId}`,
      );
    }

    if (failRedirectUrl) {
      initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${failRedirectUrl}`,
      );
    }

    if (successRedirectUrl) {
      initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${successRedirectUrl}`,
      );
    }

    return initializationURL;
  }

  updatePaymentSource({
    customerId,
    paymentSourceId,
    paymentDestinationId,
    customization,
    failRedirectUrl,
    successRedirectUrl,
  }) {
    if (!customerId) {
      throw new Error('Validation Error: customerId is required');
    }

    const customizationParams = this.convertCustomizationToURLString(
      customization,
    );

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.UPDATE_PAYMENT_SOURCE}`)
      .concat(`&${Params.CUSTOMER_ID}=${customerId}`)
      .concat(customizationParams);

    if (paymentDestinationId) {
      initializationURL.concat(
        `&${Params.PAYMENT_DESTINATION_ID}=${paymentDestinationId}`,
      );
    }

    if (paymentSourceId) {
      initializationURL.concat(
        `&${Params.PAYMENT_SOURCE_ID}=${paymentSourceId}`,
      );
    }

    if (failRedirectUrl) {
      initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${failRedirectUrl}`,
      );
    }

    if (successRedirectUrl) {
      initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${successRedirectUrl}`,
      );
    }

    return initializationURL;
  }

  pay({
    paymentIntentId,
    accountId,
    showBalances,
    customization,
    failRedirectUrl,
    successRedirectUrl,
  }) {
    if (!paymentIntentId) {
      throw new Error('Validation Error: paymentIntentId is required');
    }

    const customizationParams = this.convertCustomizationToURLString(
      customization,
    );

    let initializationURL = this.baseUrl
      .concat(`&method=${Methods.PAY}`)
      .concat(`&${Params.PAYMENT_INTENT_ID}=${paymentIntentId}`)
      .concat(customizationParams);

    if (accountId) {
      initializationURL.concat(`&${Params.ACCOUNT_ID}=${accountId}`);
    }

    if (showBalances) {
      initializationURL.concat(`&${Params.SHOW_BALANCES}=${showBalances}`);
    }

    if (failRedirectUrl) {
      initializationURL.concat(
        `&${Params.FAIL_REDIRECT_URL}=${failRedirectUrl}`,
      );
    }

    if (successRedirectUrl) {
      initializationURL.concat(
        `&${Params.SUCCESS_REDIRECT_URL}=${successRedirectUrl}`,
      );
    }

    return initializationURL;
  }
}

export default Lean;
