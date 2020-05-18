import React, { Component } from 'react';
import { View, Text } from 'react-native';

import AccountInput from './AccountInput';

import { Button } from 'react-native-elements';

import {account_types} from './WalletType';


import {RippleAPI} from 'ripple-lib';

import WalletManager from './WalletManager';

let api = new RippleAPI (
          /*  {
                server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
            } */
        );




let manager = new WalletManager();


class WalletCreate extends Component {

    constructor (props) {
        super(props);

        this.state = {
            account : null,
            secret : null,
            accountType : account_types.NONE
        };
    }


    onAccept = async () => {

        this.props.onCreate(this.state);
    };

    onExists = async () => {
      this.setState({
        account : null,
        secret : null,
        accountType : account_types.EXISTS
      });
    }

    onValidAddress = async (address) => {

      console.log("onValidAddress" + address);

      let exists = await manager.hasWallet(address);

      if (exists) {
        this.onExists();
        return;
      }

      this.setState({
          account : address,
          secret : null,
          accountType : account_types.ACCOUNT
      });
    };

    onValidSecret = async (secret) => {
      console.log("onValidSecret");
      let keypair = api.deriveKeypair(secret);
      let public_key = keypair.publicKey;


      let address = api.deriveAddress(public_key);



      let exists = await manager.hasWallet(address);

      if (exists) {
        this.onExists();
        return;
      }

      this.setState({
          account : address,
          secret : secret,
          accountType : account_types.SECRET
      });
    };

    onInValid = async (text) => {
      console.log("It's invalid");

      this.setState(
        {
          account : null,
          secret : null,
          accountType : account_types.INVALID
        }
      );
    };

    onNoText = async () => {
      console.log("It's Empty");
      this.setState({
          account : null,
          secret : null,
          accountType : account_types.NONE
      });
    };


    render () {

        let display;


        let valid = false;
        switch (this.state.accountType) {
            case account_types.NONE:
                display = <Text> </Text>;
                break;

            case account_types.INVALID:
                display = <Text>Invalid identifier</Text>;
                break;


            case account_types.EXISTS:
                  display = <Text>Acount exists</Text>;
                  break;

            case account_types.ACCOUNT:
                display = <Text>Valid address</Text>;
                valid = true;
                break;
            case account_types.SECRET:
                display = <Text>Valid secret</Text>;
                valid = true;
                break;

            case account_types.REGULAR:
                display = <Text>Valid account</Text>;
                valid = true;
                break;

        }

        let butt = null;
        if (valid) {
          butt =
            <Button
              title="Create Wallet"
              onPress={this.onAccept}

            />
          };

        return (
            <View>
                <Text>Enter an address or secret</Text>
                <AccountInput
                  onValidAddress={this.onValidAddress}
                  onValidSecret={this.onValidSecret}
                  onInValid={this.onInValid}
                  onNoText = {this.onNoText}
                />

              
                {butt}
                {display}


            </View>

        );

    }


}


export default WalletCreate;
