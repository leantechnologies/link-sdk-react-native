import React, { useRef, useImperativeHandle, useState, forwardRef } from 'react'
import WebView from 'react-native-webview'
import { Dimensions, View, StyleSheet } from 'react-native'


const LinkSDK = forwardRef((props, ref) => {
    // create a ref for injectJavaScript to use
    const SDK = useRef(null)

    // create state to manage SDK visibility
    const [isOpen, setIsOpen] = useState(false)

    // useImperativeHandle allows the methods to be called outside of the component
    useImperativeHandle(ref, () => ({
        // ALL of these functions **must** have the function passed in as a String
        // ALL of these functions must set up postMessage function to enable callback

        // initialise link flow
        link(customer_id) {
            setIsOpen(true)
            const call = `
            function postResponse(status) {
                window.ReactNativeWebView.postMessage(JSON.stringify(status))
            }

            Lean.link({
            app_token: "${props.appToken}",
            customer_id: "${customer_id}",
            permissions: ["identity", "accounts", "transactions", "balance"], 
            sandbox: ${props.sandbox},
            callback: postResponse
            })`

            console.log(call)

            SDK.current.injectJavaScript(call)
        },

        // initialise reconnect flow
        reconnect(reconnect_id) {
            setIsOpen(true)
            const call = `
            function postResponse(status) {
                window.ReactNativeWebView.postMessage(JSON.stringify(status))
            }

            Lean.reconnect({
                app_token: "${props.appToken}",
                reconnect_id: "${reconnect_id}",
                sandbox: ${props.sandbox},
                callback: postResponse
            })`

            console.log(call)

            SDK.current.injectJavaScript(call)
        },

        // initialise CPS flow
        createPaymentSource(customer_id) {
            setIsOpen(true)
            const call = `
            function postResponse(status) {
                window.ReactNativeWebView.postMessage(JSON.stringify(status))
            }

            Lean.createPaymentSource({
                app_token: "${props.appToken}",
                customer_id: "${customer_id}",
                sandbox: ${props.sandbox},
                callback: postResponse
            })`

            console.log(call)

            SDK.current.injectJavaScript(call)
        },

        // initialise pay flow
        pay(payment_intent_id) {
            setIsOpen(true)
            const call = `
            function postResponse(status) {
                window.ReactNativeWebView.postMessage(JSON.stringify(status))
            }

            Lean.pay({
                app_token: "${props.appToken}",
                payment_intent_id: "${payment_intent_id}",
                sandbox: ${props.sandbox},
                callback: postResponse
            })`

            console.log(call)

            SDK.current.injectJavaScript(call)
        }
    }));

    // The callback fired internally by the SDK to propagate to the user supplied callback and close the webview.
    const internalCallback = (data) => {
        setTimeout(() => setIsOpen(false), 300)
        if (props.callback) {
            props.callback(JSON.parse(data))
        }
        console.log(JSON.parse(data))
    }

    return (
        <View
            style={isOpen ? styles.container : styles.containerClosed}
            height={Dimensions.get('window').height}
            width={Dimensions.get('window').width}
        >
            <WebView
                ref={SDK}
                style={styles.WebView}
                originWhitelist={['*']}
                source={{ html: require('./base.js')() }}
                javaScriptEnabledAndroid={true}
                onMessage={(event)=>{
                    internalCallback(event.nativeEvent.data);
                }}
            />
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },
    containerClosed: {
        display: 'none',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },
    WebView: {
      backgroundColor: 'transparent',
    },
  });

export default LinkSDK