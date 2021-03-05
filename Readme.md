# Link SDK React Native Wrapper

The React Native Wrapper for LinkSDK allows you to do all of the functions that can be achieved with the LinkSDK on web, from linking bank accounts to initiating payments.

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
                version="1.0.0"
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