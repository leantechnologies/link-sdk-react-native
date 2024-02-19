import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
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
  const [accountId, updateAccountId] = useState('');
  const [endUserId, updateEndUserId] = useState('');
  const [customerID, updateCustomerID] = useState('');
  const [reconnectID, updateReconnectID] = useState('');
  const [bankIdentifier, updateBankIdentifier] = useState('');
  const [paymentSourceID, updatePaymentSourceID] = useState('');
  const [paymentIntentID, updatePaymentIntentID] = useState('');
  const [bulkPaymentIntentID, updateBulkPaymentIntentID] = useState('');
  const [paymentDestinationID, updatePaymentDestinationID] = useState('');

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.text}>Lean React Native Demo</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
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
          <TextInput
            value={accountId}
            placeholder="Account ID"
            style={styles.text_input}
            onChangeText={updateAccountId}
          />
          <TextInput
            value={endUserId}
            placeholder="End User ID"
            style={styles.text_input}
            onChangeText={updateEndUserId}
          />
          <TextInput
            placeholder="Bank Identifier"
            value={bankIdentifier}
            style={styles.text_input}
            onChangeText={updateBankIdentifier}
          />
          <TextInput
            placeholder="Reconnect ID"
            value={reconnectID}
            style={styles.text_input}
            onChangeText={updateReconnectID}
          />
          <TextInput
            placeholder="Payment Intent ID"
            value={paymentIntentID}
            style={styles.text_input}
            onChangeText={updatePaymentIntentID}
          />
          <TextInput
            placeholder="Bulk Payment Intent ID"
            value={bulkPaymentIntentID}
            style={styles.text_input}
            onChangeText={updateBulkPaymentIntentID}
          />
          <TextInput
            placeholder="Payment Source ID"
            value={paymentSourceID}
            style={styles.text_input}
            onChangeText={updatePaymentSourceID}
          />
          <TextInput
            placeholder="Payment Destination ID"
            value={paymentDestinationID}
            style={styles.text_input}
            onChangeText={updatePaymentDestinationID}
          />

          <TouchableOpacity
            style={styles.cta_container}
            onPress={() =>
              Lean?.current?.link({
                customer_id: customerID,
                permissions: [
                  'identity',
                  'accounts',
                  'balance',
                  'transactions',
                ],
                bank_identifier: bankIdentifier,
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
                ],
                bank_identifier: bankIdentifier,
                payment_destination_id: paymentDestinationID,
              })
            }>
            <Text style={styles.cta_text}>Connect</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cta_container}
            onPress={() =>
              Lean?.current?.reconnect({
                reconnect_id: reconnectID,
              })
            }>
            <Text style={styles.cta_text}>Reconnect</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cta_container}
            onPress={() =>
              Lean?.current?.createPaymentSource({
                customer_id: customerID,
                bank_identifier: bankIdentifier,
                payment_destination_id: paymentDestinationID,
              })
            }>
            <Text style={styles.cta_text}>Create Payment Source</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cta_container}
            onPress={() =>
              Lean?.current?.updatePaymentSource({
                customer_id: customerID,
                end_user_id: endUserId,
                payment_source_id: paymentSourceID,
                payment_destination_id: paymentDestinationID,
              })
            }>
            <Text style={styles.cta_text}>Update Payment Source</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cta_container}
            onPress={() =>
              Lean?.current?.pay({
                account_id: accountId,
                end_user_id: endUserId,
                show_balances: false,
                payment_intent_id: paymentIntentID,
                bulk_payment_intent_id: bulkPaymentIntentID,
              })
            }>
            <Text style={styles.cta_text}>Pay</Text>
          </TouchableOpacity>

          {/* The actual component that will need to be present for end users */}
          <LinkSDK
            ref={Lean}
            // @ts-ignore
            appToken={appToken}
            callback={(data: unknown) => {
              console.log('DATA SENT TO CALLBACK:', data);
              Alert.alert('Callback data', `${JSON.stringify(data)}`);
            }}
            showLogs
            customization={{
              // dialog_mode: 'uncontained',
              theme_color: 'rgb(0,152,172)',
              button_text_color: 'white',
              button_border_radius: '15',
              link_color: 'rgb(0,152,172)',
              overlay_color: 'rgb(175,182,182)',
            }}
            sandbox
            env="staging"
            // version="latest"
            // country="ae | sa"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
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
