
import React, { Component } from 'react';



import {RippleAPI} from 'ripple-lib';

import { Text, View } from 'react-native';

import { Button } from 'react-native-elements';

const api = new RippleAPI({
  server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
});

api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});

api.on('connected', () => {
  console.log('connected');
});

api.on('disconnected', (code) => {
  // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
  // will be 1000 if this was normal closure
  console.log('disconnected, code:', code);
});


class TrustControl extends Component {
        constructor (props) {
            super(props);

            this.refresh();
        }

        async refresh () {
            if (!api.isConnected()) {
                await api.connect();
            }


            let address = this.props.account;
            console.log("lines" + address);

            api.getTrustlines(address).then(trustlines =>
            {
                console.log("lines return ");
                console.log(trustlines);
            });

        }

        render () {
            return (
                <View>
                    <Text>Trust for {this.props.account}</Text>
                    <Button
                      title="Wallets"
                      onPress={this.props.onWallet}
                    />
                </View>);
        }
}

export default TrustControl;
