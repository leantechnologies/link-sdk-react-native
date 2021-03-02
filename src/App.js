import React, { useRef } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import LinkSDK from './components/LinkSDK'

export default function App() {
  // Create a ref so we can use the SDK component
  const Lean = useRef(null)

  // Simple view to demo functionality
  return (
    <View style={styles.container}>
      <Button
        title="Link Account"
        onPress={() => Lean.current.link("6865354f-aadb-4cd6-a4c9-215498b06447")}
      />
      <Button
        title="Reconnect"
        onPress={() => Lean.current.reconnect("6865354f-aadb-4cd6-a4c9-215498b06447")}
      />
      <Button
        title="Create Payment Source"
        onPress={() => Lean.current.createPaymentSource("6865354f-aadb-4cd6-a4c9-215498b06447")}
      />
      <Button
        title="Pay"
        onPress={() => Lean.current.pay("6865354f-aadb-4cd6-a4c9-215498b06447")}
      />

      {/* The actual component that will need to be present for end users */}
      <LinkSDK 
        ref={Lean}
        appToken="4028f6df76b9e6350176ccff97520017"
        callback={(data) => console.log("DATA SENT TO CALLBACK:", data)}
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
});