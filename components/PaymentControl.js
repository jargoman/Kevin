
import React, { Component } from 'react';

import { Text, View } from 'react-native';

import { Button } from 'react-native-elements';

import AccountInput from './AccountInput';

class PaymentControl extends Component {
        constructor (props) {
            super(props);

        }

        onValidAddress = async () => {

        }

        render () {
            return (
                <View>
                    <Text>Payment for account {this.props.account}</Text>
                    <AccountInput
                      onValidAddress={this.onValidAddress}
                    />
                    <Button
                      title="Wallet"
                      onPress={this.props.onWallet}
                    />
                </View>
            );
        }
}

export default PaymentControl;
