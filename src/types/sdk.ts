/**
 * Core SDK types including props, ref, response, and common types
 */

import {WebViewProps} from 'react-native-webview';
import {LeanCountry, LeanLanguage, LeanEnvironment} from './enums';
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
} from './methods';

export interface CustomizationOptions {
  theme_color?: string;
  button_text_color?: string;
  button_border_radius?: string;
  link_color?: string;
  overlay_color?: string;
  dialog_mode?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface BankInfo {
  bank_identifier: string | null;
  is_supported: boolean;
}

export interface LocalizedName {
  en?: string;
  ar?: string;
}

export type ResponseStatus = 'SUCCESS' | 'CANCELLED' | 'ERROR';

export interface LeanCallbackResponse {
  status: ResponseStatus | null;
  message: string | null;
  last_api_response: string | null;
  exit_point: string | null;
  exit_intent_point: string | null;
  exit_survey_reason: string | null;
  user_exit_intent: string | null;
  lean_correlation_id: string | null;
  secondary_status: string | null;
  bank: BankInfo;
}

export interface LinkSDKProps {
  appToken: string;
  env?: LeanEnvironment;
  country?: LeanCountry;
  language?: LeanLanguage;
  sandbox?: boolean;
  showLogs?: boolean;
  version?: string;
  customization?: CustomizationOptions;
  callback?: (response: LeanCallbackResponse) => void;
  webViewProps?: WebViewProps;
}

export interface LinkSDKRef {
  link: (params: LinkParams) => void;
  connect: (params: ConnectParams) => void;
  reconnect: (params: ReconnectParams) => void;
  createBeneficiary: (params: CreateBeneficiaryParams) => void;
  createPaymentSource: (params: CreatePaymentSourceParams) => void;
  updatePaymentSource: (params: UpdatePaymentSourceParams) => void;
  pay: (params: PayParams) => void;
  verifyAddress: (params: VerifyAddressParams) => void;
  authorizeConsent: (params: AuthorizeConsentParams) => void;
  checkout: (params: CheckoutParams) => void;
  manageConsents: (params: ManageConsentsParams) => void;
  captureRedirect: (params: CaptureRedirectParams) => void;
}
