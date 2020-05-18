import React, { Component } from 'react';
/*import Wallet from 'Wallet';*/

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList
} from 'react-native';

import { ListItem, Button } from 'react-native-elements';
import WalletManager from './WalletManager';
import WalletCreate from './WalletCreate';
import Wallet from './Wallet';
import {RippleAPI} from 'ripple-lib';


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


let manager = new WalletManager();

let NONE = "none";

let modes = {
    LOADING : 0,
    EMPTY : 1,
    NORMAL : 2,
    CREATE : 3,
    DELETEALL : 4
};

let walletsGlobal = [];

class WalletManagerView extends Component {
    constructor (props) {
        super(props);

      //  this.onCreate = this.onCreate.bind(this);

        //this.state = {mode : modes.LOADING};

        //
        this.init();

    }


    init = async () => {

        this.state = {mode : modes.LOADING};

        walletsGlobal = await manager.LoadWallets();
        if (walletsGlobal === null) {
          walletsGlobal = [];
          this.setState( { wallets : walletsGlobal, mode : modes.EMPTY } );

        } else {
          //this.setState({wallets : walletsGlobal, mode : modes.NORMAL});
        }
        this.reFresh();
    }




    onPress = async (item, index) => {


        let acc = this.state.wallets[index].account;

        this.setState({mode : acc});

    }

    onInitCreate = async () => {
      this.setState( {mode : modes.CREATE} );
    }

    onCreate = async (wallet) => {


        await manager.CreateWallet(wallet);
        this.setState({mode : modes.NORMAL});
        this.init();


    }


    onWalletReturn = async () => {
        this.setState({mode : modes.NORMAL});
    }

    onWalletDelete = async (walletName) => {

        console.log("On wallet delete" + walletName);

        await manager.deleteWallet (walletName);

        console.log("wallet deleted");
        this.setState({mode : modes.NORMAL});

        this.init();

    }

    onDeleteAll = async () => {
      this.setState({mode : modes.DELETEALL});
    }

    onDeleteAllConfirm = async () => {
      manager.deleteAll();

      this.setState ({mode : modes.EMPTY});
    }

    reFresh = async () => {



        //
        if (walletsGlobal.length > 0) {


            for (let i = 0; i < walletsGlobal.length; i++) {

                try {
                    if (!api.isConnected()) {
                      await api.connect();
                    }

                    let info = await api.getAccountInfo(walletsGlobal[i].account);

                    walletsGlobal[i].balance = info.xrpBalance;

                } catch (err) {
                  console.log(err);
                  walletsGlobal[i].balance = "network error";
                }
            }

            this.setState ({wallets : walletsGlobal, mode : modes.NORMAL});

        } else {
          this.setState ({wallets : walletsGlobal, mode : modes.EMPTY});
        }








    }

    keyExtractor = (item, index) => {
      let ind = index;
      console.log("ind");
      console.log(ind);
      console.log("item");
      console.log(item);
      return item.account;
    };
    renderItem = ({item, index}) => {

        console.log ("render");
        console.log (item);
        return (

            <ListItem
            title={item.balance || "no balance"}
            subtitle={item.account || "no account"}
            onPress={() => {this.onPress(item, index)}}
            key={item.account}
            />
        );


    };

    //

    render() {


        switch (this.state.mode) {
            case modes.LOADING:
                return (
                <View>
                    <Text>Loading Wallets ...</Text>
                </View>
                );

            case modes.EMPTY:
                return (


                <View>
                    <Text>No Wallets</Text>
                    <WalletCreate
                    onCreate={this.onCreate}
                    />
                </View>

                );

            case modes.NORMAL:
                console.log("Render NORMAL");
                let ws = this.state.wallets;
                console.log(ws);
                return (
                  <View>
                    <FlatList
                    keyExtractor = {this.keyExtractor}
                    data = {ws}
                    renderItem = {this.renderItem}
                    />
                    <Button
                    title="Create Wallet"
                    onPress={this.onInitCreate}
                    />
                    <Button
                    title="Delete All"
                    onPress={this.onDeleteAll}
                    />
                  </View>
                );

            case modes.CREATE:
              return (
                <View>

                <WalletCreate
                onCreate={this.onCreate}
                />
                <Button
                  title="Wallets"
                  onPress={this.onWalletReturn}
                />
                </View>

              );

            case modes.DELETEALL:
              return (
                <View>
                <Text>Are you sure you want to delete ALL wallets !!</Text>
                <Button
                    title="Delete"
                    onPress={this.onDeleteAllConfirm}
                />
                <Button
                    title="Cancel"
                    onPress={this.onWalletReturn}
                />

                </View>
              );
                  break;
            default:
                let account = this.state.mode;
                return (
                    <Wallet
                    address={account}
                    walletsPressed={this.onWalletReturn}
                    onDelete={() => this.onWalletDelete(account)}
                    />
                );
        }




    }



}

export default WalletManagerView;
