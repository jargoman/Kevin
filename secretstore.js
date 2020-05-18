
import * as Keychain from 'react-native-keychain';
//import DeviceInfo from 'react-native-device-info';
import { sha256 } from 'react-native-sha256';

const hashKey = "5_KJ+H:K7c&!hwZB";

export function SetSecret (address, secret) {

  
  let prehash = hashKey + address;
  //console.log('prehash ' + prehash);

  sha256(prehash).then ( hash => {
    
    Keychain.setInternetCredentials(hash, address, secret);
    
  })
  // Store the credentials
  

 
  
}

export async function GetSecret (address) {

  let prehash = hashKey + address;

  let hash = await sha256(prehash);

  console.log('second hash : ' + hash)
  try {

    // Retreive the credentials
    const credentials = await Keychain.getInternetCredentials(hash);

    
    if (credentials) {
      console.log('Credentials successfully loaded for user ' + credentials.username);
      console.log(credentials.password);
      return credentials.password;

    } else {
      console.log('No credentials stored');
    }

  } catch (error) {
    console.log('Keychain couldn\'t be accessed!', error);
  }

  return null;
}

export async function RemoveSecret () {

  let prehash = hashKey + address;

  let hash = await sha256(prehash);

  await Keychain.resetInternetCredentials(hash);

}


