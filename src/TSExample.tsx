import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import LinkSDK from './components/LinkSDK';

interface LeanMethods {
  link: (p: object) => void;
  connect: (p: object) => void;
  reconnect: (p: object) => void;
  createPaymentSource: (p: object) => void;
  updatePaymentSource: (p: object) => void;
  pay: (p: object) => void;
}

const App = () => {
  // Create a ref so we can use the SDK component
  const Lean = useRef<LeanMethods>();

  // variables for text entry
  const [appToken, updateAppToken] = useState('');
  const [customerID, updateCustomerID] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lean React Native Demo</Text>
      <TextInput
        value={appToken}
        placeholder="App Token"
        style={styles.text_input}
        onChangeText={updateAppToken}
      />
      <TextInput
        value={customerID}
        placeholder="Customer ID"
        style={styles.text_input}
        onChangeText={updateCustomerID}
      />
      <TouchableOpacity
        style={styles.cta_container}
        onPress={() =>
          Lean?.current?.link({
            customer_id: customerID,
            permissions: ['identity', 'accounts', 'balance', 'transactions'], // bank_identifier: "LEAN_MB1",
            success_redirect_url: 'https://www.google.com',
            fail_redirect_url: 'https://www.twitter.com',
          })
        }>
        <Text style={styles.cta_text}>Link</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cta_container}
        onPress={() =>
          Lean?.current?.connect({
            customer_id: customerID,
            permissions: [
              'identity',
              'accounts',
              'balance',
              'transactions',
              'payments',
            ], // bank_identifier: "LEAN_MB1",
          })
        }>
        <Text style={styles.cta_text}>Connect</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cta_container}
        onPress={() =>
          Lean?.current?.reconnect({
            reconnect_id: 'RECONNECT_ID',
          })
        }>
        <Text style={styles.cta_text}>Reconnect</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cta_container}
        onPress={() =>
          Lean?.current?.createPaymentSource({
            customer_id: 'CUSTOMER_ID',
          })
        }>
        <Text style={styles.cta_text}>Create Payment Source</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cta_container}
        onPress={() =>
          Lean?.current?.updatePaymentSource({
            customer_id: 'CUSTOMER_ID',
            payment_source_id: 'PAYMENT_SOURCE_ID',
            payment_destination_id: 'PAYMENT_DESTINATION_ID',
          })
        }>
        <Text style={styles.cta_text}>Update Payment Source</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cta_container}
        onPress={() =>
          Lean?.current?.pay({
            payment_intent_id: 'PAYMENT_INTENT_ID',
          })
        }>
        <Text style={styles.cta_text}>Pay</Text>
      </TouchableOpacity>

      {/* The actual component that will need to be present for end users */}
      <LinkSDK
        ref={Lean}
        // @ts-ignore
        appToken={appToken}
        callback={(data: unknown) =>
          console.log('DATA SENT TO CALLBACK:', data)
        }
        showLogs
        customization={{
          // dialog_mode: 'uncontained',
          theme_color: 'rgb(0,152,172)',
          button_text_color: 'white',
          button_border_radius: '15',
          link_color: 'rgb(0,152,172)',
          overlay_color: 'rgb(175,182,182)',
        }}
        // sandbox
        // env="development"
        // version="latest"
        // country="ae | sa"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta_container: {
    marginBottom: 16,
    backgroundColor: '#F4F5F5',
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 6,
  },
  cta_text: {
    color: '#0080FF',
    fontSize: 18,
  },
  text: {
    fontSize: 24,
    marginBottom: 24,
  },
  text_input: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default App;
