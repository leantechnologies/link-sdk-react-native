/**
 * Core SDK enums for the Lean React Native SDK
 */

export enum LeanPermission {
  Balance = 'balance',
  Identity = 'identity',
  Accounts = 'accounts',
  Payments = 'payments',
  Transactions = 'transactions',
  // KSA-specific permissions
  Identities = 'identities',
  Beneficiaries = 'beneficiaries',
  DirectDebits = 'direct_debits',
  StandingOrders = 'standing_orders',
  ScheduledPayments = 'scheduled_payments',
}

export enum LeanCountry {
  SA = 'sa',
  AE = 'ae',
}

export enum LeanLanguage {
  EN = 'en',
  AR = 'ar',
}

export enum LeanEnvironment {
  Production = 'production',
  Staging = 'staging',
  Development = 'development',
}
