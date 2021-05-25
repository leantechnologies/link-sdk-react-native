# Link SDK React Native Wrapper

The React Native Wrapper for LinkSDK allows you to do all of the functions that can be achieved with the LinkSDK on web, from linking bank accounts to initiating payments.

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
                sandbox
            />
        </View>
    )
}

export default App
```

---

## API Reference

| Prop     | Required | Description                                                                                            |
|----------|----------|--------------------------------------------------------------------------------------------------------|
| ref      | True     | The reference for the LinkSDK component                                                                |
| appToken | True     | The App Token can be retrieved from your Lean App Dashboard                                            |
| callback | False    | A function that you want the SDK to callback to upon closing of the SDK (whether successful or failed) |
| version  | False    | Which version of the LinkSDK you want to load (defaults to @latest)                                    |
| sandbox  | False    | Whether the LinkSDK is in sandbox or not (defaults to `False`)                                         |


## Methods

The LinkSDK supports 4 methods. `link`, `reconnect`, `createPaymentSource` and `pay`.

### link

```
    Lean.current.link({ 
        customer_id: "YOUR_CUSTOMER_ID",
        bank_identifier: "LEAN_MB1"
    })
```

| Parameter        | Required | Description                                                                                            |
|------------------|----------|--------------------------------------------------------------------------------------------------------|
| customer_id      | True     | The Customer you want to connect                                                                       |
| bank_identifier  | False    | Skips the bank selection screen                                                                        |

---

### Reconnect

```
    Lean.current.reconnect({ 
        reconnect_id: "RECONNECT_ID"
    })
```

| Parameter        | Required | Description                                                                                            |
|------------------|----------|--------------------------------------------------------------------------------------------------------|
| reconnect_id     | True     | The reconnect_id returned from the Lean API                                                            |

---

### createPaymentSource

```
    Lean.current.createPaymentSource({ 
        customer_id: "CUSTOMER_ID",
        bank_identifier: "LEAN_MB1"
    })
```

| Parameter        | Required | Description                                                                                            |
|------------------|----------|--------------------------------------------------------------------------------------------------------|
| customer_id      | True     | The Customer you want to create a payment source for                                                   |
| bank_identifier  | False    | Skips the bank selection screen                                                                        |

---

### updatePaymentSource

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

## Callbacks

By providing a callback into the component, the LinkSDK will report back with an object in the following format:

```
{
    method: "LINK",
    status: "SUCCESS",
    message: "Some message about the state of the application
}
```

| Attribute           | Type    | Description                                                                                                    |
|---------------------|---------|----------------------------------------------------------------------------------------------------------------|
| method              | ENUM    | The flow that initatied the call. `LINK`, `RECONNECT`, `CREATE_PAYMENT_SOURCE` and `PAY`                       |
| status              | ENUM    | The status of the SDK at close. `SUCCESS` - completed successfully. `CANCELLED` - user cancelled the flow. `ERROR` - something went wrong                       |
| message             | string  | Further details on the status                                                                                  |

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