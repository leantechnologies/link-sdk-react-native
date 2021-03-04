import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import LinkSDK from './components/LinkSDK'

export default function App() {
  // Create a ref so we can use the SDK component
  const Lean = useRef(null)

  // Simple view to demo functionality
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginBottom: 24}}>Lean React Native Demo</Text>
      <TouchableOpacity
        style={styles.cta_container}
        onPress={() => Lean.current.link({
          customer_id: "6865354f-aadb-4cd6-a4c9-215498b06447",
          permissions: ["identity", "accounts", "balance", "transactions"],
          bank_identifier: "LEAN_MB1",
        },
        )}
      >
        <Text style={styles.cta_text}>Link Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.cta_container}
        onPress={() => Lean.current.reconnect({
          reconnect_id: "d878280f-a3a0-4fd1-98f3-9335b32e97fe"
        },
        )}
      >
        <Text style={styles.cta_text}>Reconnect</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.cta_container}
        onPress={() => Lean.current.createPaymentSource({ 
          customer_id: "6865354f-aadb-4cd6-a4c9-215498b06447" 
        })}
      >
        <Text style={styles.cta_text}>Create Payment Source</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.cta_container}
        onPress={() => Lean.current.pay({ 
          payment_intent_id: "6865354f-aadb-4cd6-a4c9-215498b06447" 
        })}
      >
        <Text style={styles.cta_text}>Pay</Text>
      </TouchableOpacity>

      {/* The actual component that will need to be present for end users */}
      <LinkSDK 
        ref={Lean}
        appToken="4028f6df76b9e6350176ccff97520017"
        callback={(data) => console.log("DATA SENT TO CALLBACK:", data)}
        version="1.0.0"
        sandbox
      />
    </View>
  );
}

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