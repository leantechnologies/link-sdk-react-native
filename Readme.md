# Link SDK React Native Wrapper

The React Native Wrapper for LinkSDK allows you to do all the functions that can be achieved with the LinkSDK on web, from linking bank accounts to initiating payments.

## Installation

Install `lean-react-native`

```
npm install --save lean-react-native
```

If you don't already have `react-native-webview` added to your project you should also install this

```
npm install --save react-native-webview
```

Go to your ios folder and run
```
pod install
```

## Usage
The Wrapper uses a `ref` to access internal functions.

```
import React, { useRef } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import LinkSDK from 'lean-react-native'

const App = () => {
    const Lean = useRef(null)

    return (
        <View>
            <TouchableOpacity 
                onPress={() => Lean.current.link({ customer_id: "CUSTOMER_ID" })}
            >
                <Text>Link Account</Text>
            </TouchableOpacity>

            <LinkSDK
                ref={Lean}
                appToken="MY_APP_TOKEN"
                version="{version_number}"
                country="{country_of_operation}"
                sandbox
            />
        </View>
    )
}

export default App
```

---

## API Reference

| Prop               | Required | Description                                                                                                    |
|--------------------|----------|----------------------------------------------------------------------------------------------------------------|
| ref                | True     | The reference for the LinkSDK component                                                                        |
| appToken           | True     | The App Token can be retrieved from your Lean App Dashboard                                                    |
| callback           | False    | A function that you want the SDK to callback to upon closing of the SDK (whether successful or failed)         |
| version            | False    | Which version of the LinkSDK you want to load (defaults to @latest)                                            |
| country            | False    | Which country you are operating in (defaults to `ArabEmirates`) (options are `SaudiArabia` and `ArabEmirates`) |
| sandbox            | False    | Whether the LinkSDK is in sandbox or not (defaults to `False`)                                                 |


## Methods

The LinkSDK supports 6 methods. `link`, `connect`, `reconnect`, `createPaymentSource`, `updatePaymentSource`, and `pay`.

### link

Use link when you want to create an `Entity` for use with the Data API.

```
    Lean.current.link({
        customer_id: "YOUR_CUSTOMER_ID",
        permissions: ["identity","accounts","balance","transactions"],
        bank_identifier: "LEAN_MB1", //optional
        success_redirect_url: "myapp://www.myapp.com/success", // required for Open Banking banks
        fail_redirect_url: "myapp://www.myapp.com/success" // required for Open Banking banks
    })
```

| Parameter            | Required | Description                                                                         |
|----------------------|----------|-------------------------------------------------------------------------------------|
| customer_id          | True     | The Customer you want to connect                                                    |
| bank_identifier      | False    | Skips the bank selection screen                                                     |
| permissions          | True     | An array of permissions can be `identity`, `balance`, `accounts`, `transactions`    |
| success_redirect_url | False    | The URI you want to redirect to after an open banking connection has been completed |
| fail_redirect_url    | False    | The URI you want to redirect to after an open banking connection has failed         |

---

### connect

Use connect when you want to create an `Entity` and a `Payment Source` for use with the Data and Payments APIs.

```
    Lean.current.connect({
        customer_id: "YOUR_CUSTOMER_ID",
        permissions: ["identity","accounts","balance","transactions", "payments"],
        bank_identifier: "LEAN_MB1",
        payment_destination_id: "PAYMENT_DEST_ID",
        success_redirect_url: "myapp://www.myapp.com/success", // required for Open Banking banks
        fail_redirect_url: "myapp://www.myapp.com/success" // required for Open Banking banks
    })
```

| Parameter              | Required | Description                                                                                    |
|------------------------|----------|------------------------------------------------------------------------------------------------|
| customer_id            | True     | The Customer you want to connect                                                               |
| bank_identifier        | False    | Skips the bank selection screen                                                                |
| permissions            | True     | An array of permissions can be `identity`, `balance`, `accounts`, `transactions` or `payments` |
| payment_destination_id | False    | The payment destination you want to create a beneficiary with                                  |
| success_redirect_url   | False    | The URI you want to redirect to after an open banking connection has been completed            |
| fail_redirect_url      | False    | The URI you want to redirect to after an open banking connection has failed                    |

---

### reconnect

Use reconnect when a call to an `Entity` returns `RECONNECT_REQUIRED`.

```
    Lean.current.reconnect({
        reconnect_id: "RECONNECT_ID"
    })
```

| Parameter            | Required | Description                                                                         |
|----------------------|----------|-------------------------------------------------------------------------------------|
| reconnect_id         | True     | The reconnect_id returned from the Lean API                                         |
| success_redirect_url | False    | The URI you want to redirect to after an open banking connection has been completed |
| fail_redirect_url    | False    | The URI you want to redirect to after an open banking connection has failed         |

---

### createPaymentSource

Use createPaymentSource to create a `Payment Source` for use the Payments API.

```
    Lean.current.createPaymentSource({ 
        customer_id: "CUSTOMER_ID",
        bank_identifier: "LEAN_MB1",
        success_redirect_url: "myapp://www.myapp.com/success", // required for Open Banking banks
        fail_redirect_url: "myapp://www.myapp.com/success" // required for Open Banking banks
    })
```

| Parameter            | Required | Description                                                                         |
|----------------------|----------|-------------------------------------------------------------------------------------|
| customer_id          | True     | The Customer you want to create a payment source for                                |
| bank_identifier      | False    | Skips the bank selection screen                                                     |
| success_redirect_url | False    | The URI you want to redirect to after an open banking connection has been completed |
| fail_redirect_url    | False    | The URI you want to redirect to after an open banking connection has failed         |

---

### updatePaymentSource

Use updatePaymentSource to create a new beneficiary within an existing `Payment Source`.

```
    Lean.current.updatePaymentSource({ 
        customer_id: "CUSTOMER_ID",
        payment_source_id: "PAYMENT_SOURCE_ID",
        payment_destination_id: "PAYMENT_DESTINATION_ID"
    })
```

| Parameter              | Required | Description                                                                                            |
|------------------------|----------|--------------------------------------------------------------------------------------------------------|
| customer_id            | True     | The Customer you want to create a payment source for                                                   |
| payment_source_id      | True     | The Payment Source you want to update                                                                  |
| payment_destination_id | True     | The Payment Destination you want to add                                                                |

---

### pay

Use pay to initiate a payment against a `Payment Intent`.

```
    Lean.current.pay({ 
        payment_intent_id: "PAYMENT_INTENT_ID",
        account_id: "ACCOUNT_ID"
    })
```

| Parameter           | Required | Description                                                                                                    |
|---------------------|----------|----------------------------------------------------------------------------------------------------------------|
| payment_intent_id   | True     | The Customer you want to create a payment source for                                                           |
| account_id          | False    | Allows you to use a specific account for a customer payment source (available at payment_source.account[n].id) |

---

## Callbacks

By providing a callback into the component, the LinkSDK will report back with an object in the following format:

```
{
    method: "LINK",
    status: "SUCCESS",
    message: "Some message about the state of the application",
    exit_point: "SUCCESS",
    secondary_status: "SUCCESS",
    bank: {
        bank_identifier: "DIB_UAE",
        is_supported: true
    }
}
```

| Attribute            | Type   | Description                                                                                                                               |
|----------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------|
| method               | ENUM   | The flow that initiated the call. `LINK`, `RECONNECT`, `CREATE_PAYMENT_SOURCE` and `PAY`                                                  |
| status               | ENUM   | The status of the SDK at close. `SUCCESS` - completed successfully. `CANCELLED` - user cancelled the flow. `ERROR` - something went wrong |
| message              | string | Further details on the status                                                                                                             |
| exit_point           | String | The screen the user was on when they closed the SDK                                                                                       |
| secondary_status     | String | Useful when `ERROR` is the status - correlates to the ERROR reason if known.                                                              |
| bank.bank_identifier | String | The Lean identifier for the bank the user was trying to connect to                                                                        |
| bank.is_supported    | Bool   | Whether the bank is supported by Lean                                                                                                     |

## Troubleshooting

### Webview crashes on Android

You can disable hardware acceleration on the webview by passing android specific props into the webview:

```
<LinkSDK
    webViewProps={{
        androidHardwareAccelerationDisabled: true,
    }}
    appToken: "YOUR_APP_TOKEN"
    sandbox: false
>
```

### JDK version issues on Android

You may get gradle errors if you have a different JDK on the development system compared to the local JDK delivered with the Android SDK. The solution is to set JAVA_HOME in gradlew or gradlew.bat to point to the SDK JDK path. On Windows:

```
SET JAVA_HOME="\Program Files\Android\Android Studio\jre"
``` 
