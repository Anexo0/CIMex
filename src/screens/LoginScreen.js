import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Keyboard,
  Image,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import Colors from '../const/Colors';
import Assets from '../const/Assets';
import Animated, {
  FadeIn,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import ModalRegister from './ModalRegister';
import PasswordInput from '../components/PasswordInput';
import MainScreen from './MainScreen';
import CustomInput from '../components/CustomInput';
import {
  CreateKeys,
  DecryptSelf,
  EncryptServer,
  FetchWithTimeout,
  GetUserInfo,
  SetUserInfo,
  Sleep,
  VerifySelf,
} from '../const/Functions';
import {Constants, UserInfo} from '../const/Constants';
import ModalAuth from './ModalAuth';
import {NavigationContext} from '@react-navigation/native';

const Screen = Dimensions.get('window');

export default function LoginScreen(props) {
  // #region States
  const [IsKeyboard, setIsKeyboard] = useState(false);
  const [IsAnimated, setIsAnimated] = useState(false);
  const [IsModal, setIsModal] = useState(false);
  const [IsAuth, setIsAuth] = useState(false);

  const [Email, setEmail] = useState('alexisulisesperez@gmail.com');
  const [Passw, setPassw] = useState('1234');

  const [KeyboardSize, setKeyboardSize] = useState(0);

  //#endregion

  // #region References
  const RefEmail = useRef();
  const RefPass = useRef();

  const RefReg = useRef();
  const RefAuth = useRef();
  // #endregion

  // #region Other Variables
  const Nav = useContext(NavigationContext);
  const LogoY = useSharedValue(0);
  const InputsY = useSharedValue(0);
  const Alert = props.Alert;
  const Indicator = props.Indicator;
  const Theme = useColorScheme() != 'dark';
  //#endregion

  // #region Dynamic Styles

  var ViewInputs = Object.assign(
    {},
    Theme ? styles.ViewInputs : stylesDark.ViewInputs,
  );
  var Inputs = Object.assign(
    {},
    Theme ? styles.InputLogin : stylesDark.InputLogin,
  );
  if (!IsModal & !IsAuth & IsKeyboard) {
    if (Screen.height - KeyboardSize < Screen.height - Screen.width * 0.1) {
      InputsY.value =
        -(Screen.height - Screen.width * 0.1 - (Screen.height - KeyboardSize)) -
        Screen.width * 0.05;
    }
    ViewInputs.backgroundColor = Theme
      ? Colors.TransLightBackground2
      : Colors.TransDarkBackground2;
    Inputs.backgroundColor = Theme
      ? Colors.TransLightBackground2
      : Colors.TransGray;
  }
  //#endregion

  // #region Animations
  const LogoAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withDelay(
          500,
          withSpring(
            LogoY.value,
            {
              duration: 1000,
              dampingRatio: 2,
              damping: 1,
              reduceMotion: ReduceMotion.Never,
            },
            () => {
              runOnJS(setIsAnimated)(true);
            },
          ),
        ),
      },
    ],
  }));
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
  //#endregion

  // #region Functions
  const SignPressed = () => {
    RefReg.current.Show();
  };
  const LoginPressed = async () => {
    Keyboard.dismiss();
    RefEmail.current.RemoveError();
    RefPass.current.RemoveError();
    let Error = false;
    if (!Email) {
      RefEmail.current.ShowError('Llenar campo');
      Error = true;
    }
    if (!Passw) {
      RefPass.current.ShowError('Llenar campo');
      Error = true;
    }
    if (Error) return;
    Indicator.current.Show({
      Title: 'Login',
      Description: 'Verificando session y dispositivo',
    });
    const Response = await FetchWithTimeout(
      Constants.ServerLocalScripts,
      'Login',
      {email: Email},
    );
    const Res = JSON.parse(Response);
    await Sleep(2000);
    Indicator.current.Close();
    if (Res.error) {
      RefEmail.current.ShowError('Correo incorrecto');
      return;
    } else {
      Res.signature = await VerifySelf(Res.signature);
      if (Res.signature) {
        Res.password = await DecryptSelf(Res.password);
        if (Res.password == Passw) {
          Nav.navigate('Main', {Email: Email});
        } else {
          RefPass.current.ShowError('Contraseña incorrecta');
          return;
        }
      } else {
        Alert.current.Show2B({
          Title: 'No Autorizado',
          Description:
            'El actual celular no esta autorizado\n\n¿Continuar con autorizacion por email?',
          CallBack1: async () => {
            let EmailReceiver = await EncryptServer(Email);
            let Result = await FetchWithTimeout(
              Constants.ServerLocalScripts,
              'SendVerfCode',
              {
                email: EmailReceiver,
              },
            );
            RefAuth.current.Show();
          },
        });
      }
    }
  };
  // #endregion

  useEffect(() => {
    LogoY.value = -Screen.height + Screen.width * 0.1;
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardSize(Keyboard.metrics().height);
      setIsKeyboard(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', e => {
      setTimeout(() => {
        setIsKeyboard(false);
        InputsY.value = 0;
      }, 100);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View
      style={
        Theme ? styles.ViewBackgroundBehind : stylesDark.ViewBackgroundBehind
      }>
      <View
        style={Theme ? styles.ViewBackground : stylesDark.ViewBackground}>
        <Animated.View style={[styles.AViewLogo, LogoAnimation]}>
          <Image
            style={styles.ImageLogo}
            source={Theme ? Assets.Images.LightLogo : Assets.Images.Logo}
          />
        </Animated.View>
        {IsAnimated && (
          <Animated.View
            style={[ViewInputs, InputsAnimation]}
            entering={FadeIn.reduceMotion(ReduceMotion.Never)}>
            <Text
              style={
                Theme ? styles.TextInputLabelTop : stylesDark.TextInputLabelTop
              }>
              Correo
            </Text>
            <CustomInput
              Style={Inputs}
              Value={Email}
              NextRef={RefPass}
              onChangeText={Text => {
                setEmail(Text);
              }}
              Ref={RefEmail}></CustomInput>
            <Text
              style={Theme ? styles.TextInputLabel : stylesDark.TextInputLabel}>
              Contraseña
            </Text>
            <PasswordInput
              Style={Inputs}
              Value={Passw}
              onChangeText={text => {
                setPassw(text);
              }}
              Ref={RefPass}></PasswordInput>
            <TouchableOpacity
              style={Theme ? styles.ButtonLogin : stylesDark.ButtonLogin}
              onPress={LoginPressed}
              activeOpacity={0.6}>
              <Text
                style={
                  Theme ? styles.ButtonLoginText : stylesDark.ButtonLoginText
                }>
                Login
              </Text>
            </TouchableOpacity>
            <View style={styles.ViewTexts}>
              <Text
                style={
                  Theme ? styles.TextDontAccount : stylesDark.TextDontAccount
                }>
                {'Dont have a account? '}
              </Text>
              <TouchableOpacity
                style={styles.ButttonSign}
                activeOpacity={0.5}
                onPress={SignPressed}>
                <Text style={Theme ? styles.TextSignUp : stylesDark.TextSignUp}>
                  SIGN UP
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
      <ModalRegister
        Ref={RefReg}
        SetModal={setIsModal}
        Alert={Alert}
        Indicator={Indicator}></ModalRegister>
      <ModalAuth
        Ref={RefAuth}
        SetModal={setIsAuth}
        Email={Email}
        Alert={Alert}
        Indicator={Indicator}></ModalAuth>
    </View>
  );
}

const styles = StyleSheet.create({
  ViewBackgroundBehind: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.LightBackground2,
  },
  ViewBackground: {
    margin: Screen.width * 0.05,
    width: Screen.width * 0.9,
    height: Screen.height - Screen.width * 0.1,
    borderRadius: 50,
    backgroundColor: Colors.LightBackground,
  },
  ViewInputs: {
    position: 'absolute',
    top: Screen.height - Screen.height * 0.4 - Screen.width * 0.15,
    marginHorizontal: Screen.width * 0.05,
    backgroundColor: Colors.LightBackground2,
    width: Screen.width * 0.8,
    height: Screen.height * 0.4,
    borderRadius: 30,
  },
  ViewTexts: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  InputLogin: {
    marginHorizontal: '5%',
    marginTop: '1%',
    width: '90%',
    height: '15%',
    paddingLeft: 15,
    color: Colors.Black,
    backgroundColor: Colors.LightBackground2,
    borderColor: Colors.LightBackground,
    borderWidth: 3,
    borderRadius: 20,
    fontSize: 18,
  },
  TextInputLabelTop: {
    width: '80%',
    marginTop: '5%',
    marginHorizontal: '10%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
  },
  TextInputLabel: {
    width: '80%',
    marginTop: '2%',
    marginHorizontal: '10%',
    color: Colors.Black,
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
  },
  TextDontAccount: {
    marginRight: '1%',
    color: Colors.Black,
    fontSize: 15,
    fontWeight: '400',
  },
  TextSignUp: {
    marginRight: '1%',
    color: Colors.Black,
    fontSize: 15,
    fontWeight: 'bold',
  },
  AViewLogo: {
    position: 'absolute',
    top: Screen.height,
    width: Screen.width * 0.7,
    height: Screen.width * 0.7,
    alignSelf: 'center',
  },
  ImageLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  ButttonSign: {
    width: '18%',
    height: '100%',
    borderWidth: 0,
  },
  ButtonLogin: {
    width: '40%',
    height: '15%',
    marginVertical: '7%',
    backgroundColor: Colors.LightBackground2,
    borderColor: Colors.LightBackground,
    borderWidth: 3,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonLoginText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.Black,
  },
});
const stylesDark = StyleSheet.create({
  ViewBackgroundBehind: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.DarkBackground2,
  },
  ViewBackground: {
    margin: Screen.width * 0.05,
    width: Screen.width * 0.9,
    height: Screen.height - Screen.width * 0.1,
    borderRadius: 50,
    backgroundColor: Colors.DarkBackground,
  },
  ViewInputs: {
    position: 'absolute',
    top: Screen.height - Screen.height * 0.4 - Screen.width * 0.15,
    marginHorizontal: Screen.width * 0.05,
    backgroundColor: Colors.DarkBackground2,
    width: Screen.width * 0.8,
    height: Screen.height * 0.4,
    borderRadius: 30,
  },
  InputLogin: {
    marginHorizontal: '5%',
    marginTop: '1%',
    width: '90%',
    height: '17%',
    color: Colors.White,
    backgroundColor: Colors.Gray,
    borderColor: Colors.Black,
    borderWidth: 3,
    borderRadius: 20,
    fontSize: 18,
  },
  TextInputLabelTop: {
    width: '80%',
    marginTop: '5%',
    marginHorizontal: '10%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
  },
  TextInputLabel: {
    width: '80%',
    marginTop: '2%',
    marginHorizontal: '10%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
  },
  TextDontAccount: {
    marginRight: '1%',
    color: Colors.White,
    fontSize: 15,
    fontWeight: '400',
  },
  TextSignUp: {
    marginRight: '1%',
    color: Colors.White,
    fontSize: 15,
    fontWeight: 'bold',
  },
  ButtonLogin: {
    width: '40%',
    height: '15%',
    marginVertical: '7%',
    backgroundColor: Colors.Gray,
    borderColor: Colors.Black,
    borderWidth: 3,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonLoginText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.White,
  },
});
