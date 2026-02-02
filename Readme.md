# Link SDK React Native Wrapper

The React Native Wrapper for LinkSDK allows you to do all the functions that can be achieved with the LinkSDK on web, from linking bank accounts to initiating payments.

## Installation

Install `lean-react-native`

```bash
npm install --save lean-react-native
```

If you don't already have `react-native-webview` added to your project you should also install this

```bash
npm install --save react-native-webview
```

Go to your ios folder and run

```bash
pod install
```

## Usage

The Wrapper uses a `ref` to access internal functions.

### TypeScript Example

```typescript
import React, {useRef} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import LinkSDK, {
  LinkSDKRef,
  LeanPermission,
  LeanCountry,
  LeanCallbackResponse,
} from 'lean-react-native';

const App = () => {
  const lean = useRef<LinkSDKRef>(null);

  const handleCallback = (response: LeanCallbackResponse) => {
    console.log('Status:', response.status);
    console.log('Message:', response.message);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          lean.current?.connect({
            customer_id: 'CUSTOMER_ID',
            permissions: [LeanPermission.Identity, LeanPermission.Accounts],
          })
        }>
        <Text>Connect Account</Text>
      </TouchableOpacity>

      <LinkSDK
        ref={lean}
        appToken="MY_APP_TOKEN"
        country={LeanCountry.AE}
        callback={handleCallback}
        sandbox={false}
      />
    </View>
  );
};

export default App;
```

### JavaScript Example

```javascript
import React, {useRef} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import LinkSDK, {LeanPermission, LeanCountry} from 'lean-react-native';

const App = () => {
  const lean = useRef(null);

  const handleCallback = response => {
    console.log('Status:', response.status);
    console.log('Message:', response.message);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          lean.current?.connect({
            customer_id: 'CUSTOMER_ID',
            permissions: [LeanPermission.Identity, LeanPermission.Accounts],
          })
        }>
        <Text>Connect Account</Text>
      </TouchableOpacity>

      <LinkSDK
        ref={lean}
        appToken="MY_APP_TOKEN"
        country={LeanCountry.AE}
        callback={handleCallback}
        sandbox={false}
      />
    </View>
  );
};

export default App;
```

---

## API Reference

### Component Props

| Prop          | Type           | Required | Description                                                                                            |
| ------------- | -------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| ref           | `LinkSDKRef`   | True     | The reference for the LinkSDK component                                                                |
| appToken      | `string`       | True     | The App Token can be retrieved from your Lean App Dashboard                                            |
| callback      | `function`     | False    | A function that you want the SDK to callback to upon closing of the SDK (whether successful or failed) |
| version       | `string`       | False    | Which version of the LinkSDK you want to load (defaults to `"latest"`)                                 |
| country       | `LeanCountry`  | False    | Which country you are operating in (defaults to `AE`)                                                  |
| sandbox       | `boolean`      | False    | Whether the LinkSDK is in sandbox mode or not (defaults to `false`)                                    |
| language      | `LeanLanguage` | False    | SDK language - `EN` or `AR` (defaults to `EN`)                                                         |
| customization | `object`       | False    | Customization options for SDK appearance                                                               |
| webViewProps  | `WebViewProps` | False    | Additional props to pass to the underlying WebView component                                           |

### Enums

#### LeanPermission

```typescript
enum LeanPermission {
  Identity = 'identity',
  Accounts = 'accounts',
  Balance = 'balance',
  Transactions = 'transactions',
  Payments = 'payments',
  // KSA-specific permissions
  Identities = 'identities',
  Beneficiaries = 'beneficiaries',
  DirectDebits = 'direct_debits',
  StandingOrders = 'standing_orders',
  ScheduledPayments = 'scheduled_payments',
}
```

#### LeanCountry

```typescript
enum LeanCountry {
  SA = 'sa',
  AE = 'ae',
}
```

#### LeanLanguage

```typescript
enum LeanLanguage {
  EN = 'en',
  AR = 'ar',
}
```

---

## Methods

The LinkSDK supports multiple methods: `connect`, `reconnect`, `createPaymentSource`, `updatePaymentSource`, `pay`, `createBeneficiary`, `verifyAddress`, `authorizeConsent`, `checkout`, `manageConsents`, and `captureRedirect`.

### connect

Use connect when you want to create an `Entity` and a `Payment Source` for use with the Data and Payments APIs.

```typescript
lean.current?.connect({
  customer_id: 'YOUR_CUSTOMER_ID',
  permissions: [
    LeanPermission.Identity,
    LeanPermission.Accounts,
    LeanPermission.Balance,
    LeanPermission.Transactions,
    LeanPermission.Payments,
  ],
  bank_identifier: 'LEAN_MB1',
  payment_destination_id: 'PAYMENT_DEST_ID',
  success_redirect_url: 'myapp://success',
  fail_redirect_url: 'myapp://fail',
});
```

| Parameter                | Type               | Required | Description                                                   |
| ------------------------ | ------------------ | -------- | ------------------------------------------------------------- |
| customer_id              | `string`           | True     | The Customer you want to connect                              |
| permissions              | `LeanPermission[]` | True     | Array of permissions                                          |
| bank_identifier          | `string`           | False    | Skips the bank selection screen                               |
| payment_destination_id   | `string`           | False    | The payment destination you want to create a beneficiary with |
| success_redirect_url     | `string`           | False    | The URI you want to redirect to after completion              |
| fail_redirect_url        | `string`           | False    | The URI you want to redirect to after failure                 |
| access_token             | `string`           | False    | Access token for authentication                               |
| access_to                | `string`           | False    | Access end date                                               |
| access_from              | `string`           | False    | Access start date                                             |
| show_consent_explanation | `boolean`          | False    | Whether to show consent explanation screen                    |
| account_type             | `string`           | False    | Account type filter                                           |
| customer_metadata        | `string`           | False    | Custom metadata for the customer                              |
| destination_alias        | `string`           | False    | Alias for the payment destination                             |
| destination_avatar       | `string`           | False    | Avatar URL for the payment destination                        |

---

### reconnect

Use reconnect when a call to an `Entity` returns `RECONNECT_REQUIRED`.

```typescript
lean.current?.reconnect({
  reconnect_id: 'RECONNECT_ID',
});
```

| Parameter          | Type     | Required | Description                             |
| ------------------ | -------- | -------- | --------------------------------------- |
| reconnect_id       | `string` | True     | The reconnect_id returned from Lean API |
| access_token       | `string` | False    | Access token for authentication         |
| destination_alias  | `string` | False    | Alias for the destination               |
| destination_avatar | `string` | False    | Avatar URL for the destination          |

---

### createPaymentSource

Use createPaymentSource to create a `Payment Source` for use with the Payments API.

```typescript
lean.current?.createPaymentSource({
  customer_id: 'CUSTOMER_ID',
  bank_identifier: 'LEAN_MB1',
  success_redirect_url: 'myapp://success',
  fail_redirect_url: 'myapp://fail',
});
```

| Parameter              | Type     | Required | Description                                        |
| ---------------------- | -------- | -------- | -------------------------------------------------- |
| customer_id            | `string` | True     | The Customer you want to create payment source for |
| bank_identifier        | `string` | False    | Skips the bank selection screen                    |
| success_redirect_url   | `string` | False    | The URI to redirect to after completion            |
| fail_redirect_url      | `string` | False    | The URI to redirect to after failure               |
| payment_destination_id | `string` | False    | Payment destination identifier                     |
| access_token           | `string` | False    | Access token for authentication                    |
| destination_alias      | `string` | False    | Alias for the destination                          |
| destination_avatar     | `string` | False    | Avatar URL for the destination                     |

---

### updatePaymentSource

Use updatePaymentSource to create a new beneficiary within an existing `Payment Source`.

```typescript
lean.current?.updatePaymentSource({
  customer_id: 'CUSTOMER_ID',
  payment_source_id: 'PAYMENT_SOURCE_ID',
  payment_destination_id: 'PAYMENT_DESTINATION_ID',
});
```

| Parameter              | Type     | Required | Description                             |
| ---------------------- | -------- | -------- | --------------------------------------- |
| customer_id            | `string` | True     | The Customer ID                         |
| payment_destination_id | `string` | True     | The Payment Destination you want to add |
| payment_source_id      | `string` | False    | The Payment Source you want to update   |
| entity_id              | `string` | False    | Entity identifier                       |
| fail_redirect_url      | `string` | False    | The URI to redirect to after failure    |
| success_redirect_url   | `string` | False    | The URI to redirect to after completion |
| access_token           | `string` | False    | Access token for authentication         |
| destination_alias      | `string` | False    | Alias for the destination               |
| destination_avatar     | `string` | False    | Avatar URL for the destination          |

---

### pay

Use pay to initiate a payment against a `Payment Intent`.

```typescript
lean.current?.pay({
  payment_intent_id: 'PAYMENT_INTENT_ID',
  account_id: 'ACCOUNT_ID',
});
```

| Parameter              | Type          | Required | Description                                                                                                    |
| ---------------------- | ------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| payment_intent_id      | `string`      | False    | The Payment Intent ID                                                                                          |
| bulk_payment_intent_id | `string`      | False    | Bulk payment intent ID                                                                                         |
| account_id             | `string`      | False    | Allows you to use a specific account for a customer payment source (available at payment_source.account[n].id) |
| show_balances          | `boolean`     | False    | Whether to show account balances                                                                               |
| fail_redirect_url      | `string`      | False    | The URI to redirect to after failure                                                                           |
| success_redirect_url   | `string`      | False    | The URI to redirect to after completion                                                                        |
| access_token           | `string`      | False    | Access token for authentication                                                                                |
| destination_alias      | `string`      | False    | Alias for the destination                                                                                      |
| destination_avatar     | `string`      | False    | Avatar URL for the destination                                                                                 |
| risk_details           | `RiskDetails` | False    | Risk assessment details for                                                                                    |
| bank_identifier        | `string`      | False    | Bank identifier to pre-select                                                                                  |

---

### createBeneficiary

Use createBeneficiary to create a beneficiary for a payment source.

```typescript
lean.current?.createBeneficiary({
  customer_id: 'CUSTOMER_ID',
  payment_destination_id: 'PAYMENT_DESTINATION_ID',
});
```

| Parameter              | Type     | Required | Description                                       |
| ---------------------- | -------- | -------- | ------------------------------------------------- |
| customer_id            | `string` | True     | The Customer ID                                   |
| payment_destination_id | `string` | True     | The Payment Destination to create beneficiary for |
| payment_source_id      | `string` | False    | Payment Source identifier                         |
| entity_id              | `string` | False    | Entity identifier                                 |
| fail_redirect_url      | `string` | False    | The URI to redirect to after failure              |
| success_redirect_url   | `string` | False    | The URI to redirect to after completion           |
| access_token           | `string` | False    | Access token for authentication                   |
| destination_alias      | `string` | False    | Alias for the destination                         |
| destination_avatar     | `string` | False    | Avatar URL for the destination                    |

---

### verifyAddress

Use verifyAddress to verify customer address information.

```typescript
lean.current?.verifyAddress({
  customer_id: 'CUSTOMER_ID',
  customer_name: 'John Doe',
});
```

| Parameter          | Type               | Required | Description                     |
| ------------------ | ------------------ | -------- | ------------------------------- |
| customer_id        | `string`           | True     | The Customer ID                 |
| customer_name      | `string`           | True     | Customer's full name            |
| permissions        | `LeanPermission[]` | False    | Array of permissions            |
| access_token       | `string`           | False    | Access token for authentication |
| destination_alias  | `string`           | False    | Alias for the destination       |
| destination_avatar | `string`           | False    | Avatar URL for the destination  |

---

### authorizeConsent

Use authorizeConsent to authorize a consent request.

```typescript
lean.current?.authorizeConsent({
  customer_id: 'CUSTOMER_ID',
  consent_id: 'CONSENT_ID',
  success_redirect_url: 'myapp://success',
  fail_redirect_url: 'myapp://fail',
});
```

| Parameter            | Type          | Required | Description                     |
| -------------------- | ------------- | -------- | ------------------------------- |
| customer_id          | `string`      | True     | The Customer ID                 |
| consent_id           | `string`      | True     | The Consent ID to authorize     |
| success_redirect_url | `string`      | True     | Redirect URL on success         |
| fail_redirect_url    | `string`      | True     | Redirect URL on failure         |
| access_token         | `string`      | False    | Access token for authentication |
| destination_alias    | `string`      | False    | Alias for the destination       |
| destination_avatar   | `string`      | False    | Avatar URL for the destination  |
| risk_details         | `RiskDetails` | False    | Risk assessment details         |

---

### checkout

Use checkout for payment checkout flow.

```typescript
lean.current?.checkout({
  payment_intent_id: 'PAYMENT_INTENT_ID',
  success_redirect_url: 'myapp://success',
  fail_redirect_url: 'myapp://fail',
});
```

| Parameter            | Type          | Required | Description                     |
| -------------------- | ------------- | -------- | ------------------------------- |
| payment_intent_id    | `string`      | True     | The Payment Intent ID           |
| success_redirect_url | `string`      | True     | Redirect URL on success         |
| fail_redirect_url    | `string`      | True     | Redirect URL on failure         |
| access_token         | `string`      | False    | Access token for authentication |
| customer_name        | `string`      | False    | Customer name                   |
| bank_identifier      | `string`      | False    | Bank identifier                 |
| risk_details         | `RiskDetails` | False    | Risk assessment details         |

---

### manageConsents

Use manageConsents to manage user consents.

```typescript
lean.current?.manageConsents({
  customer_id: 'CUSTOMER_ID',
});
```

| Parameter    | Type     | Required | Description                     |
| ------------ | -------- | -------- | ------------------------------- |
| customer_id  | `string` | True     | The Customer ID                 |
| access_token | `string` | False    | Access token for authentication |

---

### captureRedirect

Use captureRedirect to handle redirect captures.

```typescript
lean.current?.captureRedirect({
  customer_id: 'CUSTOMER_ID',
  consent_attempt_id: 'CONSENT_ATTEMPT_ID',
});
```

| Parameter              | Type     | Required | Description                     |
| ---------------------- | -------- | -------- | ------------------------------- |
| customer_id            | `string` | True     | The Customer ID                 |
| consent_attempt_id     | `string` | False    | Consent attempt ID              |
| consent_id             | `string` | False    | Consent ID                      |
| access_token           | `string` | False    | Access token for authentication |
| granular_status_code   | `string` | False    | Granular status code            |
| status_additional_info | `string` | False    | Additional status information   |

---

## Callbacks

By providing a callback into the component, the LinkSDK will report back with a typed response object:

```typescript
interface LeanCallbackResponse {
  status: 'SUCCESS' | 'CANCELLED' | 'ERROR' | null;
  message: string | null;
  last_api_response: string | null;
  exit_point: string | null;
  exit_intent_point: string | null;
  exit_survey_reason: string | null;
  user_exit_intent: string | null;
  lean_correlation_id: string | null;
  secondary_status: string | null;
  bank: {
    bank_identifier: string | null;
    is_supported: boolean;
  };
}
```

**Example:**

```typescript
const handleCallback = (response: LeanCallbackResponse) => {
  if (response.status === 'SUCCESS') {
    console.log('Connection successful!');
  } else if (response.status === 'ERROR') {
    console.error('Error:', response.message);
  } else if (response.status === 'CANCELLED') {
    console.log('User cancelled');
  }
};
```

| Attribute            | Type      | Description                                                                                     |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| status               | `string`  | The status of the SDK at close. `SUCCESS`, `CANCELLED`, or `ERROR`                              |
| message              | `string`  | Further details on the status                                                                   |
| last_api_response    | `string`  | Last API response received                                                                      |
| exit_point           | `string`  | The screen the user was on when they closed the SDK                                             |
| exit_intent_point    | `string`  | The specific point where the user indicated exit intent                                         |
| exit_survey_reason   | `string`  | The reason provided in the exit survey                                                          |
| user_exit_intent     | `string`  | Indicates why a user exited a payment flow (`USER_CANCELLED_PAYMENT`, `USER_COMPLETED_PAYMENT`) |
| lean_correlation_id  | `string`  | Unique identifier for correlating the session                                                   |
| secondary_status     | `string`  | Useful when `ERROR` is the status - correlates to the ERROR reason if known                     |
| bank.bank_identifier | `string`  | The Lean identifier for the bank the user was trying to connect to                              |
| bank.is_supported    | `boolean` | Whether the bank is supported by Lean                                                           |

---

## Customization

You can customize the appearance of the SDK:

```typescript
<LinkSDK
  ref={lean}
  appToken="MY_APP_TOKEN"
  customization={{
    theme_color: '#00A651',
    button_text_color: '#FFFFFF',
    button_border_radius: '8',
    link_color: '#00A651',
    overlay_color: 'rgba(0,0,0,0.5)',
  }}
/>
```

---

## Migration from v3 to v4

v4.0.0 introduces TypeScript with type-safe enums. Here's how to migrate:

**Why a major version?** v4 introduces TypeScript-first typings (including ref/types). Upgrading may break TypeScript builds, linting, and CI pipelines due to type mismatches, so a major bump is the safest signal.

### Before (v3)

```javascript
import LinkSDK from 'lean-react-native';

<LinkSDK country="ae" />;

lean.current.link({
  permissions: ['identity', 'accounts'],
});
```

### After (v4)

```typescript
import LinkSDK, {LeanCountry, LeanPermission} from 'lean-react-native';

<LinkSDK country={LeanCountry.AE} />;

lean.current?.connect({
  permissions: [LeanPermission.Identity, LeanPermission.Accounts],
});
```

**Note:** String values still work at runtime for backwards compatibility, but using enums provides better autocomplete and type safety.

---

## Troubleshooting

### Webview crashes on Android

You can disable hardware acceleration on the webview by passing android specific props into the webview:

```typescript
<LinkSDK
  webViewProps={{
    androidHardwareAccelerationDisabled: true,
  }}
  appToken="YOUR_APP_TOKEN"
  sandbox={false}
/>
```

### JDK version issues on Android

You may get gradle errors if you have a different JDK on the development system compared to the local JDK delivered with the Android SDK. The solution is to set JAVA_HOME in gradlew or gradlew.bat to point to the SDK JDK path. On Windows:

```
SET JAVA_HOME="\Program Files\Android\Android Studio\jre"
```

---

## TypeScript Support

This package includes full TypeScript definitions. All types are exported from the main package:

```typescript
import LinkSDK, {
  // Component types
  LinkSDKRef,
  LinkSDKProps,

  // Enums
  LeanPermission,
  LeanCountry,
  LeanLanguage,

  // Response types
  LeanCallbackResponse,
  ResponseStatus,

  // Method parameter types
  ConnectParams,
  PayParams,
  ReconnectParams,
  // ... and more
} from 'lean-react-native';
```

---

## License

MIT

## Support

For support, please contact [support@leantech.me](mailto:support@leantech.me) or visit our [documentation](https://docs.leantech.me).
