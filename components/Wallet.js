import React, { Component } from 'react';

import { Text, View } from 'react-native';

import { Button } from 'react-native-elements';

import WalletManager from './WalletManager';

import TrustControl from './TrustControl';
import PaymentControl from './PaymentControl';
import TradeControl from './TradeControl';

let manager = new WalletManager();

let states = {

    NONE : 0,
    PAYMENT : 1,
    TRADE : 2,
    TRUST : 3,
    DELETE : 4

};


class Wallet extends Component {
    constructor (props) {
      super(props);

      this.state = {mode : states.NONE};

    }

    paymentsPressed = () => {
        this.setState ({mode : states.PAYMENT});
    }

    tradingPressed = () => {
      this.setState({mode : states.TRADE});
    };

    trustPressed = () => {
      this.setState({mode : states.TRUST});
    };

    deletePropose = () => {
      this.setState({mode : states.DELETE});
    };

    onWallet = () => {
      this.setState({mode : states.NONE});
    }

    render() {

        switch (this.state.mode) {
            case states.NONE:
                return (
                    <View>
                        <Text>{this.props.address}</Text>

                        <Button
                            title="Payments"

                            onPress={this.paymentsPressed}
                        />

                        <Button
                            title="Trading"
                            onPress={this.tradingPressed}
                        />

                        <Button
                            title="Trust"
                            onPress={this.trustPressed}
                        />

                        <Button
                            title="Wallets"
                            onPress={this.props.walletsPressed}
                        />
                        <Button
                            title="Delete Wallet"
                            onPress={this.deletePropose}
                        />
                    </View>
                );

            case states.PAYMENT:
                return (
                    <PaymentControl
                        onWallet={this.onWallet}
                        account={this.props.address}
                    />
                );

            case states.TRUST:
                return (
                    <TrustControl
                        onWallet={this.onWallet}
                        account={this.props.address}
                    />
                );


            case states.TRADE:
                return (
                    <TradeControl
                        account={this.props.address}
                        onWallet={this.onWallet}
                    />
                );

            case states.DELETE:
                return (
                    <View>
                        <Text>Are you sure you want to delete account {this.props.account}</Text>
                        <Button
                            title="Delete"
                            onPress={this.props.onDelete}
                        />
                        <Button
                            title="Cancel"
                            onPress={this.onWallet}
                        />
                    </View>
                );
        }


    }
}

export default Wallet;
