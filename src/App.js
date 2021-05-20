/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native';
import LinkSDK from './components/LinkSDK'

const App = () => {
  // Create a ref so we can use the SDK component
  const Lean = useRef(null)

  // variables for text entry
  const [ appToken, updateAppToken ] = useState(null) 
  const [ customerID, updateCustomerID ] = useState(null) 

   // Simple view to demo functionality
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginBottom: 24}}>Lean React Native Demo</Text>
      <TextInput
        placeholder="App Token"
        value={appToken}
        onChangeText={updateAppToken}
      />
      <TextInput
        placeholder="Customer ID"
        value={customerID}
        onChangeText={updateCustomerID}
      />
      <TouchableOpacity
        style={styles.cta_container}
        onPress={() => Lean.current.link({
          customer_id: customerID,
          permissions: ["identity", "accounts", "balance", "transactions"],
          // bank_identifier: "LEAN_MB1",
        },
        )}
      >
        <Text style={styles.cta_text}>Link Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.cta_container}
        onPress={() => Lean.current.reconnect({
          reconnect_id: "RECONNECT_ID"
        },
        )}
      >
        <Text style={styles.cta_text}>Reconnect</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.cta_container}
        onPress={() => Lean.current.createPaymentSource({ 
          customer_id: "CUSTOMER_ID" 
        })}
      >
        <Text style={styles.cta_text}>Create Payment Source</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cta_container}
        onPress={() => Lean.current.updatePaymentSource({ 
            customer_id: "CUSTOMER_ID",
            payment_source_id: "PAYMENT_SOURCE_ID",
            payment_destination_id: "PAYMENT_DESTINATION_ID"
        })}
      >
        <Text style={styles.cta_text}>Update Payment Source</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.cta_container}
        onPress={() => Lean.current.pay({ 
          payment_intent_id: "PAYMENT_INTENT_ID" 
        })}
      >
        <Text style={styles.cta_text}>Pay</Text>
      </TouchableOpacity>

      {/* The actual component that will need to be present for end users */}
      <LinkSDK 
        ref={Lean}
        appToken={appToken}
        callback={(data) => console.log("DATA SENT TO CALLBACK:", data)}
        // version="1.0.0"
        // sandbox
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
    fontSize: 18
  }
});

export default App;
