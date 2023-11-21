export const UserPermissions = {
  BALANCE: 'balance',
  IDENTITY: 'identity',
  ACCOUNTS: 'accounts',
  PAYMENTS: 'payments',
  TRANSACTIONS: 'transactions',

  // KSA permissions
  IDENTITIES: 'identities',
  BENEFICIARIES: 'beneficiaries',
  DIRECT_DEBITS: 'direct_debits',
  STANDING_ORDERS: 'standing_orders',
  SCHEDULED_PAYMENTS: 'scheduled_payments',
};

export const Country = {
  SAUDI_ARABIA: 'sa',
  UNITED_ARAB_EMIRATES: 'ae',
};

export const Config = {
  // Base config
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

export const Params = {
  INITIALIZATION_URL: 'initialization_url',
  PAYMENT_INTENT_ID: 'payment_intent_id',
  PAYMENT_INTENT_IDS: 'payment_intent_ids',
  BULK_PAYMENT_INTENT_ID: 'bulk_payment_intent_id',
  SHOW_BALANCES: 'show_balances',
  RECONNECT_ID: 'reconnect_id',
  CUSTOMER_ID: 'customer_id',
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
};

export const Methods = {
  PAY: 'pay',
  LINK: 'link',
  CONNECT: 'connect',
  RECONNECT: 'reconnect',
  CREATE_BENEFICIARY: 'createBeneficiary',
  CREATE_PAYMENT_SOURCE: 'createPaymentSource',
  UPDATE_PAYMENT_SOURCE: 'updatePaymentSource',
};
