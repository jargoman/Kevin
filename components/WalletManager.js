import { AsyncStorage } from "react-native";

import {account_types} from './WalletType';

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


var walletListName = "_0_walletlist";



class WalletManager {
    constructor () {


    }

    async LoadAccounts () {
        try {
            let wallets = await AsyncStorage.getItem(walletListName);

            let list = JSON.parse (wallets);

            if (list !== null) {
                  return list;
            }



        } catch (error) {

        }

        return null;
    }

    async LoadWallets () {

        let accounts = await this.LoadAccounts();

        if (accounts === null) {
            return null;
        }

        let wallets = accounts.map ((x) => {return {account : x, balance : "default"};} );

        return wallets;
    }

    async deleteWallet (account) {

        try {
            await AsyncStorage.removeItem (account);
        } catch (err) {

        }
        try {

            let accounts = await this.LoadAccounts();

            if (accounts === null) {

                return;

            }

            accounts = accounts.filter(acc => acc != account);



            console.log(accounts);

            let json1 = JSON.stringify (accounts);


            await AsyncStorage.setItem(walletListName, json1);

            console.log("Walletlist altered");

            //await Promise.all(prom1, prom2);

        } catch (error) {
            console.log(error);
        }

    }

    async CreateWallet (wallet) {


       // let identifier = wallets.account;


        switch (wallet.accountType) {
            case account_types.SECRET:
                console.log("Create Secret");
                console.log(wallet);
                break;

            case account_types.ACCOUNT:
                console.log ("Create Account");
                break;

            case account_types.INVALID:
                console.log("Create Invalid");
                return;

            case account_types.NONE:
                console.log ("Create None");
                return;

            case account_types.EXISTS:
                return;
        }


        try {

            let wallets = await this.LoadAccounts();

            if (wallets === null) {
                wallets = [wallet.account];


            } else {
                wallets.push (wallet.account);
            }

            let json1 = JSON.stringify (wallets);
            //let json2 = JSON.stringify (wallet);

            let prom1 = AsyncStorage.setItem(walletListName, json1);
            let prom2 = this.SaveWallet(wallet);

            await Promise.all(prom1, prom2);

        } catch (error) {
            console.log(error);
        }
    }

    async deleteAll () {

      let accounts = await this.LoadAccounts ();

      accounts.forEach ( (item) => {
        AsyncStorage.removeItem(item);
      });
      AsyncStorage.setItem(walletListName, "[]");
    }

    async SaveWallet (wallet) {
        let json = JSON.stringify (wallet);
        await AsyncStorage.setItem(wallet.account, json);
    }

    async GetWallet (address) {
        await AsyncStorage.getItem(address);
    }

    async hasWallet (account) {
      let accounts = await this.LoadAccounts();
      if (accounts == null) {
        return false;
      }

      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i] == account) {
          return true;
        }

      }

      return false;
    }

}


export default WalletManager;
