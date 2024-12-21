import {
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  View,
  TextInput,
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
  GetKeys,
} from '../const/Functions';
import SingleInputs from '../components/SingleInputs';
import {opacity} from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import {Constants} from '../const/Constants';
import { NavigationContext } from '@react-navigation/native';

const Screen = Dimensions.get('window');

export default function ModalAuth(props) {
  // #region States
  const [IsModal, SetIsModal] = useState(false);
  const [IsAnimatedBack, SetIsAnimatedBack] = useState(false);
  const [IsAnimatedInput, SetIsAnimatedInput] = useState(false);

  const [Counter, SetCounter] = useState(30);

  const [Code, SetCode] = useState('');

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

  const ViewTexts = Object.assign(
    {opacity: Counter ? 0.5 : 1},
    styles.ViewTexts,
  );
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
  const Show = () => {
    setTimeout(() => {
      SetIsAnimatedInput(true);
    }, 100);
    SetIsModal(true);
    SetIsAnimatedBack(true);
    props.SetModal(true);
    SetCounter(30);
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
  const ResendPressed = async () => {
    let EmailReceiver = await EncryptServer(props.Email);
    let Result = await FetchWithTimeout(
      Constants.ServerLocalScripts,
      'SendVerfCode',
      {
        email: EmailReceiver,
      },
    );
    SetCounter(30);
  };
  const EnviarPressed = async () => {
    Keyboard.dismiss()
    const Key = await GetKeys();
    const Signature = await SignatureSelf();
    const Email = await EncryptServer(props.Email);
    const VerfCode = await EncryptServer(Code);
    const Result = await FetchWithTimeout(
      Constants.ServerLocalScripts,
      'VerifyVerfCode',
      {
        key: Key.publicKey,
        signature: Signature,
        email: Email,
        verfCode: VerfCode,
      },
    );
    if (Result == 1) {
      Close();
      Alert.current.Show1B({
        Title: 'Codigo Correcto',
        Description:
          'Codigo introducido era correcto puede continuar con el login de su cuenta',
        CallBack: () => {
          Nav.navigate("Main")
        },
      });
    } else {
    }

    console.log(Result);
  };
  // #endregion

  useEffect(() => {
    const Timer = setInterval(() => {
      if (Counter) SetCounter(Counter - 1);
    }, 1000);
    return () => {
      clearInterval(Timer);
    };
  }, [Counter]);

  useEffect(() => {
    if (props.Ref) {
      props.Ref.current = {
        Show: Show,
        Close: Close,
        IsModal: IsModal,
      };
    }
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
                  <Text style={Theme ? styles.TextStart : stylesDark.TextStart}>
                    {`Un correo con tu codigo de\nverificacion fue enviado a tu direccion de correo:\n\n${props.Email}`}
                  </Text>
                  <SingleInputs
                    style={
                      Theme ? styles.SingleInputs : stylesDark.SingleInputs
                    }
                    value={Code}
                    setValue={SetCode}></SingleInputs>
                  <View style={ViewTexts}>
                    <Text
                      style={
                        Theme ? styles.TextCounter : stylesDark.TextNoEmail
                      }>
                      {`No recibiste correo`}
                    </Text>
                    <TouchableOpacity
                      style={styles.ButttonResend}
                      disabled={!!Counter}
                      activeOpacity={Counter ? 1 : 0.5}
                      onPress={ResendPressed}>
                      <Text
                        style={
                          Theme ? styles.TextResend : stylesDark.TextResend
                        }>
                        Reenviar
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={Theme ? styles.TextCounter : stylesDark.TextCounter}>
                    {Counter ? `En ${Counter}s` : ''}
                  </Text>
                  <TouchableOpacity
                    style={Theme ? styles.ButtonReg : stylesDark.ButtonSend}
                    activeOpacity={0.6}
                    onPress={EnviarPressed}>
                    <Text
                      style={
                        Theme ? styles.ButtonRegText : stylesDark.ButtonSendText
                      }>
                      Enviar
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
    top: Screen.height - Screen.height * 0.4 - Screen.width * 0.15,
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
  SingleInputs: {
    flexDirection: 'row',
    height: '20%',
    backgroundColor: Colors.Gray,
  },
  ViewTexts: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: '5%',
  },
  ButttonResend: {
    width: '18%',
    height: '100%',
    borderWidth: 0,
  },
});
const stylesDark = StyleSheet.create({
  Container: {
    position: 'absolute',
    top: Screen.height * 0.05,
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
  TextStart: {
    height: '30%',
    marginVertical: '10%',
    color: Colors.White,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
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
  TextNoEmail: {
    marginRight: '1%',
    color: Colors.White,
    fontSize: 15,
    fontWeight: '400',
  },
  TextResend: {
    color: Colors.White,
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  TextCounter: {
    color: Colors.White,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
  ButtonSend: {
    marginTop: '10%',
    width: '30%',
    height: '12.5%',
    backgroundColor: Colors.Gray,
    borderColor: Colors.Black,
    borderWidth: 3,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonSendText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.White,
  },
  SingleInputs: {
    height: '15%',
    marginHorizontal: Screen.width * 0.05,
  },
});
