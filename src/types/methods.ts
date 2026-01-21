import {LeanPermission} from './enums';
import {RiskDetails} from './risk-details';

export interface LinkParams {
  customer_id: string;
  permissions: Array<LeanPermission>;
  bank_identifier?: string;
  fail_redirect_url?: string;
  success_redirect_url?: string;
  access_token?: string;
}

export interface ConnectParams {
  customer_id: string;
  permissions: Array<LeanPermission>;
  access_to?: string;
  access_from?: string;
  end_user_id?: string;
  bank_identifier?: string;
  fail_redirect_url?: string;
  success_redirect_url?: string;
  payment_destination_id?: string;
  show_consent_explanation?: boolean;
  account_type?: string;
  customer_metadata?: string;
  access_token?: string;
  destination_alias?: string;
  destination_avatar?: string;
}

export interface ReconnectParams {
  reconnect_id: string;
  access_token?: string;
  destination_alias?: string;
  destination_avatar?: string;
}

export interface CreateBeneficiaryParams {
  customer_id: string;
  payment_destination_id: string;
  payment_source_id?: string;
  entity_id?: string;
  fail_redirect_url?: string;
  success_redirect_url?: string;
  access_token?: string;
  destination_alias?: string;
  destination_avatar?: string;
}

export interface CreatePaymentSourceParams {
  customer_id: string;
  bank_identifier?: string;
  fail_redirect_url?: string;
  success_redirect_url?: string;
  payment_destination_id?: string;
  access_token?: string;
  destination_alias?: string;
  destination_avatar?: string;
}

export interface UpdatePaymentSourceParams {
  customer_id: string;
  payment_destination_id: string;
  end_user_id?: string;
  payment_source_id?: string;
  entity_id?: string;
  fail_redirect_url?: string;
  success_redirect_url?: string;
  access_token?: string;
  destination_alias?: string;
  destination_avatar?: string;
}

export interface PayParams {
  payment_intent_id?: string;
  bulk_payment_intent_id?: string;
  account_id?: string;
  end_user_id?: string;
  show_balances?: boolean;
  fail_redirect_url?: string;
  success_redirect_url?: string;
  access_token?: string;
  destination_alias?: string;
  destination_avatar?: string;
  risk_details?: RiskDetails;
  bank_identifier?: string;
}

export interface VerifyAddressParams {
  customer_id: string;
  customer_name: string;
  permissions?: Array<LeanPermission>;
  access_token?: string;
  destination_alias?: string;
  destination_avatar?: string;
}

export interface AuthorizeConsentParams {
  consent_id: string;
  customer_id: string;
  fail_redirect_url: string;
  success_redirect_url: string;
  access_token?: string;
  destination_alias?: string;
  destination_avatar?: string;
  risk_details?: RiskDetails;
}

export interface CheckoutParams {
  payment_intent_id: string;
  success_redirect_url: string;
  fail_redirect_url: string;
  access_token?: string;
  customer_name?: string;
  bank_identifier?: string;
  risk_details?: RiskDetails;
}

export interface ManageConsentsParams {
  customer_id: string;
  access_token?: string;
}

export interface CaptureRedirectParams {
  customer_id: string;
  consent_attempt_id?: string;
  consent_id?: string;
  access_token?: string;
  granular_status_code?: string;
  status_additional_info?: string;
}
