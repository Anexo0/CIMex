import {
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Colors from '../const/Colors';
import Animated, {
  FadeIn,
  FadeOut,
  ReduceMotion,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  CreateKeys,
  EncryptServer,
  EncryptSelf,
  FetchWithTimeout,
  Sleep,
  SignatureSelf,
  VerifySelf,
} from '../const/Functions';
import PasswordInput from '../components/PasswordInput';
import {Constants} from '../const/Constants';
import CustomInput from '../components/CustomInput';
import { NavigationContext } from '@react-navigation/native';

const Screen = Dimensions.get('window');

export default function ModalRegister(props) {
  // #region States
  const [IsModal, SetIsModal] = useState(false);
  const [IsAnimatedBack, SetIsAnimatedBack] = useState(false);
  const [IsAnimatedInput, SetIsAnimatedInput] = useState(false);
  const [InEmail, SetInEmail] = useState("alexisulisesperez@gmail.com");
  const [InPassw, SetInPassw] = useState("1234");
  const [InPasswConf, SetInPasswConf] = useState("1234");

  // #endregion

  // #region References
  const RefRegEmail = useRef();
  const RefRegPass = useRef();
  const RefRegPassConf = useRef();
  // #endregion

  // #region Other Variables
  const Nav = useContext(NavigationContext);
  const InputsY = useSharedValue(0);
  const Theme = useColorScheme() != 'dark';
  const Alert = props.Alert;
  const Indicator = props.Indicator;
  // #endregion

  // #region Animations
  const InputsAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(InputsY.value, {
          duration: 1000,
          dampingRatio: 0.5,
          reduceMotion: ReduceMotion.Never,
        }),
      },
    ],
  }));

  // #endregion

  // #region Functions
  const RegisterUser = async () => {
    RefRegEmail.current.RemoveError();
    RefRegPass.current.RemoveError();
    RefRegPassConf.current.RemoveError();
    let Error = false;

    if (!InEmail) {
      RefRegEmail.current.ShowError('Campo vacio');
      Error = true;
    } else {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!regex.test(InEmail)) {
        RefRegEmail.current.ShowError('Correo invalido');
        Error = true;
      }
    }
    if (!InPassw) {
      RefRegPass.current.ShowError('Campo vacio');
      Error = true;
    }
    if (!InPasswConf) {
      RefRegPassConf.current.ShowError('Campo vacio');
      Error = true;
    } else {
      if (InPassw != InPasswConf) {
        RefRegPass.current.ShowError('Contraseñas no coinciden');
        RefRegPassConf.current.ShowError('Contraseñas no coinciden');
        Error = true;
      }
    }
    if (Error) return;

    Indicator.current.Show({
      Title: 'Verificando',
      Description: 'Verificando email ingresado',
    });
    await Sleep(1500);
    const Email = await EncryptServer(InEmail.toLocaleLowerCase());
    const EmailExist = await FetchWithTimeout(
      Constants.ServerLocalScripts,
      'VerifyEmail',
      {
        email: Email,
      },
    );
    if (EmailExist == 0) {
      Indicator.current.Close();
      Alert.current.Show1B({
        Title: 'Error',
        Description:
          'Correo ya esta previamente registrado\n\nIntentar de nuevo',
      });
      return;
    }

    Indicator.current.Show({
      Title: 'Generando',
      Description: 'Generando Llaves de autentificacion',
    });
    await Sleep(1500);
    const Keys = await CreateKeys();
    const PublicKey = await EncryptServer(Keys.publicKey);

    Indicator.current.Show({
      Title: 'Registrando',
      Description: `Registrando usuario ${InEmail}`,
    });
    await Sleep(1500);
    const EncryptedPassword = await EncryptServer(InPassw);
    const Signature = await SignatureSelf();
    const Result1 = await FetchWithTimeout(
      Constants.ServerLocalScripts,
      'Register',
      {
        email: Email,
        password: EncryptedPassword,
        key: PublicKey,
        signature: Signature,
      },
    );
    Indicator.current.Close();
    console.log(Result1);
    if (Result1 == 1) {
      Alert.current.Show1B({
        Title: `Registro Exitoso`,
        Description: `Usuario fue registrado exitosamente\n\n${InEmail.toLocaleLowerCase()}`,
        CallBack: () => {
          Close();
          Nav.navigate('Main', {Email: InEmail});
        },
      });
      return;
    } else {
      Alert.current.Show1B({
        Title: `Error`,
        Description: `Unknown error check error log`,
        CallBack: () => {
          Close();
        },
      });
    }
    return;
  };
  const Show = () => {
    setTimeout(() => {
      SetIsAnimatedInput(true);
    }, 100);
    SetIsModal(true);
    SetIsAnimatedBack(true);
    props.SetModal(true);
  };
  const Close = () => {
    setTimeout(() => {
      SetIsAnimatedBack(false);
    }, 100);
    setTimeout(() => {
      SetIsModal(false);
    }, 300);
    SetIsAnimatedInput(false);
    props.SetModal(false);
  };
  // #endregion

  useEffect(() => {
    if (props.Ref) {
      props.Ref.current = {
        Show: Show,
        Close: Close,
        IsModal: IsModal,
      };
    }
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      if (Screen.height - Keyboard.metrics().height < Screen.height * 0.75) {
        InputsY.value =
          -(
            Screen.height * 0.75 -
            (Screen.height - Keyboard.metrics().height)
          ) * 1.15;
      }
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', e => {
      setTimeout(() => {
        InputsY.value = 0;
      }, 100);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View style={IsModal ? styles.Modal : null}>
      {IsAnimatedBack && (
        <Animated.View
          style={[{flex: 1}]}
          entering={FadeIn.reduceMotion(ReduceMotion.Never)}
          exiting={FadeOut.reduceMotion(ReduceMotion.Never)}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.Background}
            onPress={Close}>
            {IsAnimatedInput && (
              <Animated.View
                style={[
                  Theme ? styles.Container : stylesDark.Container,
                  InputsAnimation,
                ]}
                entering={SlideInDown.duration(500).reduceMotion(
                  ReduceMotion.Never,
                )}
                exiting={SlideOutDown.duration(500).reduceMotion(
                  ReduceMotion.Never,
                )}>
                <TouchableOpacity style={{flex: 1}} activeOpacity={1}>
                  <Text
                    style={
                      Theme ? styles.TextLabelInput : stylesDark.TextLabelInput
                    }>
                    Correo
                  </Text>
                  <CustomInput
                    Style={Theme ? styles.TextInputs : stylesDark.TextInputs}
                    Value={InEmail}
                    returnKeyType="next"
                    Ref={RefRegEmail}
                    NextRef={RefRegPass}
                    onChangeText={Text => {
                      SetInEmail(Text);
                    }}></CustomInput>
                  <Text
                    style={
                      Theme ? styles.TextLabelInput : stylesDark.TextLabelInput
                    }>
                    Contraseña
                  </Text>
                  <PasswordInput
                    Style={Theme ? styles.TextInputs : stylesDark.TextInputs}
                    Value={InPassw}
                    onChangeText={text => {
                      SetInPassw(text);
                    }}
                    Ref={RefRegPass}
                    NextRef={RefRegPassConf}></PasswordInput>
                  <Text
                    style={
                      Theme ? styles.TextLabelInput : stylesDark.TextLabelInput
                    }>
                    Confirma Contraseña
                  </Text>
                  <PasswordInput
                    Style={Theme ? styles.TextInputs : stylesDark.TextInputs}
                    Value={InPasswConf}
                    onChangeText={text => {
                      SetInPasswConf(text);
                    }}
                    Ref={RefRegPassConf}></PasswordInput>
                  <TouchableOpacity
                    style={Theme ? styles.ButtonReg : stylesDark.ButtonReg}
                    onPress={RegisterUser}
                    activeOpacity={0.6}>
                    <Text
                      style={
                        Theme ? styles.ButtonRegText : stylesDark.ButtonRegText
                      }>
                      Registrar
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Modal: {
    width: Screen.width,
    height: Screen.height,
    backgroundColor: Colors.Transparent,
    position: 'absolute',
  },
  Background: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.TransGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Container: {
    position: 'absolute',
    top: Screen.height * 0.1,
    width: '80%',
    height: '50%',
    borderRadius: 50,
    borderWidth: 5,
    borderColor: Colors.DarkBackground,
    backgroundColor: Colors.DarkBackground2,
  },
  TextLabelInput: {
    width: '80%',
    marginTop: '5%',
    marginHorizontal: '10%',
    color: Colors.Black,
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
  },
  TextInputs: {},
  ButtonReg: {
    width: '45%',
    height: '12.5%',
    marginVertical: '10%',
    backgroundColor: Colors.LightBackground2,
    borderColor: Colors.LightBackground,
    borderWidth: 3,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonRegText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.Black,
  },
});
const stylesDark = StyleSheet.create({
  Container: {
    position: 'absolute',
    top: Screen.height * 0.25,
    width: '80%',
    height: Screen.height * 0.5,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: Colors.DarkBackground,
    backgroundColor: Colors.DarkBackground2,
  },
  TextLabelInput: {
    width: '80%',
    marginTop: '5%',
    marginHorizontal: '10%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
  },
  TextInputs: {
    marginHorizontal: '5%',
    marginTop: '1%',
    width: '90%',
    height: '15%',
    color: Colors.White,
    backgroundColor: Colors.Gray,
    borderColor: Colors.Black,
    borderWidth: 3,
    borderRadius: 20,
    fontSize: 18,
  },
  ButtonReg: {
    width: '45%',
    height: '12.5%',
    marginVertical: '10%',
    backgroundColor: Colors.Gray,
    borderColor: Colors.Black,
    borderWidth: 3,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonRegText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.White,
  },
});
