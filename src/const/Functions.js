import EncryptedStorage from 'react-native-encrypted-storage';
import RSA, {Hash} from 'react-native-fast-rsa';
import {Constants} from './Constants';

const MaxLength = 190

export function Sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function GenerateToken() {
  let Token = '';
  for (i = 0; i < 200; i++) {
    Token += String.fromCharCode(Math.floor(Math.random() * (126 - 33)) + 33);
  }
  return Token;
}

export async function SetUserInfo(Data, Item = "UserInfo") {
  try {
    await EncryptedStorage.setItem(Item, JSON.stringify(Data));
  } catch (error) {
    console.error(error);
  }
}
export async function GetUserInfo(Item = "UserInfo") {
  try {
    const Data = await EncryptedStorage.getItem(Item);
    if (Data !== null) {
      return Item == "UserInfo" ? JSON.parse(Data) : Data
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function SetKeys(Data) {
  try {
    await EncryptedStorage.setItem('RsaKeys', Data);
  } catch (error) {
    console.error(error);
  }
}
export async function GetKeys() {
  try {
    const Data = await EncryptedStorage.getItem('RsaKeys').then(Keys =>
      JSON.parse(Keys),
    );
    if (Data) {
      return Data;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function CreateKeys() {
  try {
    const Keys = await RSA.generate(2048).then(Keys => {
      return JSON.stringify(Keys);
    });
    await SetKeys(Keys);
    return JSON.parse(Keys);
  } catch (error) {
    console.error(error);
  }
}

export async function GetServerPublicKey() {
  let ServerKey = await FetchWithTimeout(
    Constants.ServerLocalScripts,
    'GetServerPublicKey',
  );
  return ServerKey
}

export async function FetchWithTimeout(Url, Action, Values = {}, Method = "POST") {
  let Request = `${Url}${Action}?`;
  let Parameters = new FormData();
  for (let Value in Values) {
    Parameters.append(Value, Values[Value]);
  }
  const timeout = 5000;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(Request, {
    method: Method,
    body: Object.keys(Values).length ? Parameters : null,
    signal: controller.signal,
  }).then(response => {
    return response.text();
  });
  clearTimeout(id);
  return response;
}

export async function SignatureSelf() {
  const Key = await GetKeys()
  const Signature = await RSA.signPKCS1v15("Cimex02", Hash.SHA256, Key.privateKey)
  return Signature
}
export async function VerifySelf(Signature) {
  let Verf = true
  try { 
    const Key = await GetKeys()
    Verf = await RSA.verifyPKCS1v15(Signature, "Cimex02", Hash.SHA256, Key.publicKey)
  } catch {
    Verf = false
  }
  return Verf
}
export async function EncryptSelf(String) {
  const Key = await GetKeys();
  let Encrypted = ""
  if (String.length > MaxLength) {
    for (i = 0; i < String.length; i += MaxLength) {
      const Text = String.slice(i, i+MaxLength)
      Encrypted += `${await RSA.encryptOAEP(Text, '', Hash.SHA256, Key.publicKey)},`
    }
    Encrypted = Encrypted.slice(0, Encrypted.length-1)
  } else {
    Encrypted = await RSA.encryptOAEP(String, '', Hash.SHA256, Key.publicKey);
  }
  return Encrypted;
}
export async function DecryptSelf(String) {
  const Key = await GetKeys();
  let Decrypted = ""
  let Sections = String.split(",")
  for (let i in Sections) {
    Decrypted = await RSA.decryptOAEP(Sections[i], '', Hash.SHA256, Key.privateKey)
  }
  return Decrypted
}
export async function StringToSend(String) {
  const Data = Array.from(String, _ => _.charCodeAt(0));
  return Data;
}
export async function EncryptServer(String) {
  const Key = await GetServerPublicKey();
  let Encrypted = ""
  if (String.length > MaxLength) {
    for (i = 0; i < String.length; i += MaxLength) {
      const Text = String.slice(i, i+MaxLength)
      Encrypted += `${await RSA.encryptOAEP(Text, '', Hash.SHA256, Key)},`
    }
    Encrypted = Encrypted.slice(0, Encrypted.length-1)
  } else {
    Encrypted = await RSA.encryptOAEP(String, '', Hash.SHA256, Key);
  }
  return Encrypted;
}


