import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import {RippleAPI} from 'ripple-lib';


let api = new RippleAPI (
          /*  {
                server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
            } */
        );

class AccountInput extends Component {
  constructor (props) {
      super (props);

  }

  onChangeText = async (text) => {

      text = text.trim();
      /*
      if (!api.isConnected()) {
          await api.connect();
      }
      */

       if (api.isValidAddress(text.toString())) {
          // address only

          this.props.onValidAddress(text);

      } else if (api.isValidSecret(text)) {
          // secret and address

          this.props.onValidSecret(text);

      } else if (text == "") {
          // other

        this.props.onNoText();

      } else {
        this.props.onInValid(text);
      }

      return text;
  }

  render () {
    return (
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={ text => this.onChangeText(text) }
      />
      );
  }
}

export default AccountInput;
