import React, {useRef, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import LinkSDK, {
  LinkSDKRef,
  LeanPermission,
  LeanCallbackResponse,
  LeanEnvironment,
  LeanCountry,
} from './components/LinkSDK';

const App = () => {
  // Create a ref so we can use the SDK component
  const Lean = useRef<LinkSDKRef>(null);

  const [appToken, updateAppToken] = useState('');
  // Link
  const [link_customerID, updateLinkCustomerID] = useState('');
  const [link_bankIdentifier, updateLinkBankIdentifier] = useState('');

  // Connect
  const [connect_customerID, updateConnectCustomerID] = useState('');
  const [connect_bankIdentifier, updateConnectBankIdentifier] = useState('');
  const [connect_paymentDestinationID, updateConnectPaymentDestinationID] =
    useState('');

  // Reconnect
  const [reconnectID, updateReconnectID] = useState('');

  // Create Beneficiary
  const [customerID, updateCustomerID] = useState('');
  const [paymentSourceID, updatePaymentSourceID] = useState('');
  const [paymentDestinationID, updatePaymentDestinationID] = useState('');

  // Pay
  const [isShowBalances, setIsShowBalances] = useState(false);
  const [accountId, updateAccountId] = useState('');
  const [paymentIntentID, updatePaymentIntentID] = useState('');

  // Authorize Consent
  const [authorize_customerID, updateAuthorizeCustomerID] = useState('');
  const [consentID, updateConsentID] = useState('');
  const [authorize_failRedirectURL, updateAuthorizeFailRedirectURL] =
    useState('');
  const [authorize_successRedirectURL, updateAuthorizeSuccessRedirectURL] =
    useState('');

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.text}>LeanSDK React Native Demo</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.group}>
            <TextInput
              id="appToken"
              value={appToken}
              placeholder="App Token"
              style={styles.text_input}
              onChangeText={updateAppToken}
            />
          </View>

          <View style={styles.group}>
            <TextInput
              id="linkCustomerId"
              value={link_customerID}
              placeholder="Customer ID"
              style={styles.text_input}
              onChangeText={updateLinkCustomerID}
            />

            <TextInput
              id="linkBankIdentifier"
              placeholder="Bank Identifier"
              value={link_bankIdentifier}
              style={styles.text_input}
              onChangeText={updateLinkBankIdentifier}
            />

            <TouchableOpacity
              style={styles.cta_container}
              disabled={!appToken || !link_customerID}
              onPress={() =>
                Lean?.current?.link({
                  customer_id: link_customerID,
                  permissions: [
                    LeanPermission.Identity,
                    LeanPermission.Accounts,
                    LeanPermission.Balance,
                    LeanPermission.Transactions,
                  ],
                  bank_identifier: link_bankIdentifier,
                  success_redirect_url: 'https://www.google.com',
                  fail_redirect_url: 'https://www.twitter.com',
                })
              }>
              <Text style={styles.cta_text}>Link</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.group}>
            <TextInput
              id="connectCustomerId"
              value={connect_customerID}
              placeholder="Customer ID"
              style={styles.text_input}
              onChangeText={updateConnectCustomerID}
            />

            <TextInput
              id="connectBankIdentifier"
              placeholder="Bank Identifier"
              value={connect_bankIdentifier}
              style={styles.text_input}
              onChangeText={updateConnectBankIdentifier}
            />

            <TextInput
              id="connectPaymentDestinationId"
              placeholder="Payment Destination ID"
              value={connect_paymentDestinationID}
              style={styles.text_input}
              onChangeText={updateConnectPaymentDestinationID}
            />

            <TouchableOpacity
              style={styles.cta_container}
              disabled={!appToken || !connect_customerID}
              onPress={() =>
                Lean?.current?.connect({
                  customer_id: connect_customerID,
                  permissions: [
                    LeanPermission.Identity,
                    LeanPermission.Accounts,
                    LeanPermission.Balance,
                    LeanPermission.Transactions,
                    LeanPermission.Payments,
                  ],
                  bank_identifier: connect_bankIdentifier,
                  payment_destination_id: connect_paymentDestinationID,
                })
              }>
              <Text style={styles.cta_text}>Connect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.group}>
            <TextInput
              id="reconnectId"
              placeholder="Reconnect ID"
              value={reconnectID}
              style={styles.text_input}
              onChangeText={updateReconnectID}
            />

            <TouchableOpacity
              style={styles.cta_container}
              disabled={!appToken || !reconnectID}
              onPress={() =>
                Lean?.current?.reconnect({
                  reconnect_id: reconnectID,
                })
              }>
              <Text style={styles.cta_text}>Reconnect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.group}>
            <TextInput
              value={customerID}
              id="createBeneficiaryCustomerId"
              placeholder="Customer ID"
              style={styles.text_input}
              onChangeText={updateCustomerID}
            />
            <TextInput
              id="createBeneficiaryPaymentSourceId"
              placeholder="Payment Source ID"
              value={paymentSourceID}
              style={styles.text_input}
              onChangeText={updatePaymentSourceID}
            />
            <TextInput
              id="createBeneficiaryPaymentDestinationId"
              placeholder="Payment Destination ID"
              value={paymentDestinationID}
              style={styles.text_input}
              onChangeText={updatePaymentDestinationID}
            />

            <TouchableOpacity
              style={styles.cta_container}
              disabled={
                !appToken ||
                !customerID ||
                !paymentSourceID ||
                !paymentDestinationID
              }
              onPress={() =>
                Lean?.current?.updatePaymentSource({
                  customer_id: customerID,
                  payment_source_id: paymentSourceID,
                  payment_destination_id: paymentDestinationID,
                })
              }>
              <Text style={styles.cta_text}>Create Beneficiary</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.group}>
            <View style={styles.switchContainer}>
              <Text>Show Balances</Text>
              <Switch
                style={styles.switch}
                onValueChange={() =>
                  setIsShowBalances(previousState => !previousState)
                }
                id="showBalancesToggle"
                value={isShowBalances}
              />
            </View>

            <TextInput
              id="payAccountId"
              value={accountId}
              placeholder="Account ID"
              style={styles.text_input}
              onChangeText={updateAccountId}
            />
            <TextInput
              id="paymentIntentId"
              placeholder="Payment Intent ID"
              value={paymentIntentID}
              style={styles.text_input}
              onChangeText={updatePaymentIntentID}
            />

            <TouchableOpacity
              style={styles.cta_container}
              disabled={!appToken || !paymentIntentID}
              onPress={() =>
                Lean?.current?.pay({
                  account_id: accountId,
                  show_balances: isShowBalances,
                  payment_intent_id: paymentIntentID,
                })
              }>
              <Text style={styles.cta_text}>Pay</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.group}>
            <TextInput
              id="authorizeCustomerId"
              value={authorize_customerID}
              placeholder="Customer ID"
              style={styles.text_input}
              onChangeText={updateAuthorizeCustomerID}
            />
            <TextInput
              id="consentId"
              placeholder="Consent ID"
              value={consentID}
              style={styles.text_input}
              onChangeText={updateConsentID}
            />
            <TextInput
              id="authorizeFailRedirectUrl"
              placeholder="Fail Redirect URL"
              value={authorize_failRedirectURL}
              style={styles.text_input}
              onChangeText={updateAuthorizeFailRedirectURL}
            />
            <TextInput
              id="authorizeSuccessRedirectUrl"
              placeholder="Success Redirect URL"
              value={authorize_successRedirectURL}
              style={styles.text_input}
              onChangeText={updateAuthorizeSuccessRedirectURL}
            />

            <TouchableOpacity
              style={styles.cta_container}
              disabled={
                !appToken ||
                !authorize_customerID ||
                !consentID ||
                !authorize_failRedirectURL ||
                !authorize_successRedirectURL
              }
              onPress={() =>
                Lean?.current?.authorizeConsent({
                  customer_id: authorize_customerID,
                  consent_id: consentID,
                  fail_redirect_url: authorize_failRedirectURL,
                  success_redirect_url: authorize_successRedirectURL,
                })
              }>
              <Text style={styles.cta_text}>Authorize Consent</Text>
            </TouchableOpacity>
          </View>

          {/* The actual component that will need to be present for end users */}
          <LinkSDK
            ref={Lean}
            appToken={appToken}
            callback={(data: LeanCallbackResponse) => {
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
            env={LeanEnvironment.Staging}
            // version="latest"
            country={LeanCountry.AE}
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
  group: {
    padding: 20,
    backgroundColor: '#F4F5F5',
    marginBottom: 14,
  },
  cta_container: {
    backgroundColor: '#0080FF',
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 6,
  },
  cta_text: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 24,
  },
  text_input: {
    fontSize: 16,
    marginBottom: 16,
    borderStyle: 'solid',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  switch: {
    transform: [{scaleX: 0.7}, {scaleY: 0.7}],
  },
});

export default App;
