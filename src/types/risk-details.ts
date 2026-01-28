/**
 * Risk details types and enums for payment risk assessment
 */

import {LocalizedName} from './sdk';

// ============= ENUMS =============

export enum AuthenticationChannel {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
}

export enum PossessionFactorType {
  FIDO2_SECURITY_KEY = 'FIDO2_SECURITY_KEY',
  PASSKEY = 'PASSKEY',
  OTP_DEVICE = 'OTP_DEVICE',
  OTP_APP = 'OTP_APP',
  SMS_OTP = 'SMS_OTP',
  EMAIL_OTP = 'EMAIL_OTP',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  WEBAUTHN_TOKEN = 'WEBAUTHN_TOKEN',
  SECURE_ENCLAVE_KEY = 'SECURE_ENCLAVE_KEY',
  HARDWARE_OTP_KEY = 'HARDWARE_OTP_KEY',
  TRUSTED_DEVICE = 'TRUSTED_DEVICE',
  OTHER = 'OTHER',
}

export enum KnowledgeFactorType {
  PIN = 'PIN',
  PASSWORD = 'PASSWORD',
  SECURITY_QUESTION = 'SECURITY_QUESTION',
  SMS_OTP = 'SMS_OTP',
  EMAIL_OTP = 'EMAIL_OTP',
  OTP_PUSH = 'OTP_PUSH',
  OTHER = 'OTHER',
}

export enum InherenceFactorType {
  BIOMETRIC = 'BIOMETRIC',
  FINGERPRINT = 'FINGERPRINT',
  FACE_RECOGNITION = 'FACE_RECOGNITION',
  IRIS_SCAN = 'IRIS_SCAN',
  VOICE_RECOGNITION = 'VOICE_RECOGNITION',
  FIDO_BIOMETRIC = 'FIDO_BIOMETRIC',
  DEVICE_BIOMETRICS = 'DEVICE_BIOMETRICS',
  OTHER = 'OTHER',
}

export enum ChallengeOutcome {
  PASS = 'PASS',
  FAIL = 'FAIL',
  NOT_PERFORMED = 'NOT_PERFORMED',
}

export enum AuthenticationFlow {
  MFA = 'MFA',
  OTHER = 'OTHER',
}

export enum DeviceType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
  WEARABLE = 'WEARABLE',
  OTHER = 'OTHER',
}

export enum ConnectionType {
  WIFI = 'WIFI',
  CELLULAR = 'CELLULAR',
  OTHER = 'OTHER',
}

export enum ScreenOrientation {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
}

export enum BindingStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  SUSPENDED = 'SUSPENDED',
}

export enum BiometricType {
  FINGERPRINT = 'FINGERPRINT',
  FACIAL_RECOGNITION = 'FACIAL_RECOGNITION',
  IRIS = 'IRIS',
  VOICE_PRINT = 'VOICE_PRINT',
  OTHER = 'OTHER',
}

export enum MotionSensorStatus {
  IN_MOTION = 'IN_MOTION',
  STATIONARY = 'STATIONARY',
}

export enum DeviceEnvironmentContext {
  VPN_DETECTED = 'VPN_DETECTED',
  EMULATOR_DETECTED = 'EMULATOR_DETECTED',
}

export enum ScrollDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  BOTH = 'BOTH',
}

export enum SuspiciousActivity {
  NO_SUSPICIOUS_ACTIVITY = 'NO_SUSPICIOUS_ACTIVITY',
  SUSPICIOUS_ACTIVITY_DETECTED = 'SUSPICIOUS_ACTIVITY_DETECTED',
}

export enum RecipientType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE',
}

export enum AddressType {
  BUSINESS = 'BUSINESS',
  CORRESPONDENCE = 'CORRESPONDENCE',
  RESIDENTIAL = 'RESIDENTIAL',
}

export enum Channel {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
}

export enum ChannelType {
  ECOMMERCE = 'ECOMMERCE',
  IN_STORE = 'IN_STORE',
  IN_APP = 'IN_APP',
  TELEPHONE = 'TELEPHONE',
  MAIL = 'MAIL',
  RECURRING_PAYMENT = 'RECURRING_PAYMENT',
  OTHER = 'OTHER',
}

export enum SubChannelType {
  WEB_BROWSER = 'WEB_BROWSER',
  MOBILE_APP = 'MOBILE_APP',
  SMART_TV = 'SMART_TV',
  WEARABLE_DEVICE = 'WEARABLE_DEVICE',
  POS_TERMINAL = 'POS_TERMINAL',
  ATM = 'ATM',
  KIOSK_TERMINAL = 'KIOSK_TERMINAL',
  OTHER = 'OTHER',
}

export enum DeliveryTimeframe {
  ELECTRONIC_DELIVERY = 'ELECTRONIC_DELIVERY',
  SAME_DAY_SHIPPING = 'SAME_DAY_SHIPPING',
  OVERNIGHT_SHIPPING = 'OVERNIGHT_SHIPPING',
  MORE_THAN_1_DAY_SHIPPING = 'MORE_THAN_1_DAY_SHIPPING',
}

export enum ReorderItemsIndicator {
  FIRST_TIME_ORDER = 'FIRST_TIME_ORDER',
  REORDER = 'REORDER',
}

export enum PreOrderPurchaseIndicator {
  MERCHANDISE_AVAILABLE = 'MERCHANDISE_AVAILABLE',
  FUTURE_AVAILABILITY = 'FUTURE_AVAILABILITY',
}

export enum AddressMatchLevel {
  FULL_MATCH = 'FULL_MATCH',
  PARTIAL_MATCH = 'PARTIAL_MATCH',
  NO_MATCH = 'NO_MATCH',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

// ============= TYPES =============

// Debtor Indicators
export interface PossessionFactor {
  is_used?: boolean;
  type?: PossessionFactorType;
}

export interface KnowledgeFactor {
  is_used?: boolean;
  type?: KnowledgeFactorType;
}

export interface InherenceFactor {
  is_used?: boolean;
  type?: InherenceFactorType;
}

export interface Authentication {
  authentication_channel?: AuthenticationChannel;
  possession_factor?: PossessionFactor;
  knowledge_factor?: KnowledgeFactor;
  inherence_factor?: InherenceFactor;
  challenge_outcome?: ChallengeOutcome;
  authentication_flow?: AuthenticationFlow;
  authentication_value?: string;
  challenge_date_time?: string;
}

export interface GeoLocation {
  latitude: number | string;
  longitude: number | string;
}

export interface DeviceManufacturer {
  model?: string;
  manufacturer?: string;
}

export interface ScreenInformation {
  pixel_density?: number;
  orientation?: ScreenOrientation;
}

export interface BatteryStatus {
  level?: number;
  is_charging?: boolean;
}

export interface TouchSupport {
  supported?: boolean;
  max_touch_points?: number;
}

export interface MotionSensors {
  status?: MotionSensorStatus;
  accelerometer?: boolean;
  gyroscope?: boolean;
}

export interface DeviceInformation {
  device_id?: string;
  alternative_device_id?: string;
  device_operating_system?: string;
  device_operating_system_version?: string;
  device_binding_id?: string;
  last_binding_date_time?: string;
  binding_duration?: string;
  binding_status?: BindingStatus;
  device_type?: DeviceType;
  device_manufacturer?: DeviceManufacturer;
  device_language?: string;
  device_local_date_time?: string;
  connection_type?: ConnectionType;
  screen_information?: ScreenInformation;
  battery_status?: BatteryStatus;
  touch_support?: TouchSupport;
  motion_sensors?: MotionSensors;
  device_environment_context?: DeviceEnvironmentContext[];
}

export interface BiometricCapabilities {
  supports_biometric?: boolean;
  biometric_types?: BiometricType[];
}

export interface AppInformation {
  app_version?: string;
  package_name?: string;
  build_number?: string;
}

export interface ScrollBehavior {
  direction?: ScrollDirection;
  speed?: number;
  frequency?: number;
}

export interface UserBehavior {
  scroll_behavior?: ScrollBehavior;
}

export interface TransactionHistory {
  last_day?: number;
  last_year?: number;
}

export interface AccountRiskIndicators {
  user_onboarding_date_time?: string;
  last_account_change_date?: string;
  last_password_change_date?: string;
  suspicious_activity?: SuspiciousActivity;
  transaction_history?: TransactionHistory;
}

export interface DebtorIndicators {
  authentication?: Authentication;
  user_name?: LocalizedName;
  geo_location?: GeoLocation;
  device_information?: DeviceInformation;
  biometric_capabilities?: BiometricCapabilities;
  app_information?: AppInformation;
  user_behavior?: UserBehavior;
  account_risk_indicators?: AccountRiskIndicators;
  supplementary_data?: Record<string, unknown>;
}

// Destination Delivery Address
export interface NationalAddress {
  address_type?: AddressType;
  address_line?: string;
  building_number?: string;
  building_name?: string;
  floor?: string;
  street_name?: string;
  district_name?: string;
  post_box?: string;
  town_name?: string;
  region?: string;
  country?: string;
}

export interface DestinationDeliveryAddress {
  recipient_type?: RecipientType;
  recipient_name?: LocalizedName;
  national_address?: NationalAddress[];
}

// Transaction Indicators
export interface MerchantRisk {
  delivery_timeframe?: DeliveryTimeframe;
  reorder_items_indicator?: ReorderItemsIndicator;
  pre_order_purchase_indicator?: PreOrderPurchaseIndicator;
  is_gift_card_purchase?: boolean;
  is_delivery_address_matches_billing?: boolean;
  address_match_level?: AddressMatchLevel;
}

export interface TransactionIndicators {
  is_customer_present?: boolean;
  is_contract_present?: boolean;
  channel?: Channel;
  channel_type?: ChannelType;
  sub_channel_type?: SubChannelType;
  merchant_risk?: MerchantRisk;
  supplementary_data?: Record<string, unknown>;
}

// Payment Process
export interface PaymentProcess {
  total_duration?: number;
  current_session_attempts?: number;
  current_session_failed_attempts?: number;
  last24_hour_attempts?: number;
  last24_hour_failed_attempts?: number;
}

// Main RiskDetails Interface
export interface RiskDetails {
  debtor_indicators?: DebtorIndicators;
  destination_delivery_address?: DestinationDeliveryAddress;
  transaction_indicators?: TransactionIndicators;
  payment_process?: PaymentProcess;
}
