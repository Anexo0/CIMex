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
import MoneyInput from '../components/MoneyInput';

const Screen = Dimensions.get('window');

export default function ModalBudget(props) {
  // #region States
  const [IsModal, SetIsModal] = useState(false);
  const [IsAnimatedBack, SetIsAnimatedBack] = useState(false);
  const [IsAnimatedInput, SetIsAnimatedInput] = useState(false);

  const [Budget, setBudget] = useState(0)

  // #endregion

  // #region References

  // #endregion

  // #region Other Variables
  const Nav = useContext(NavigationContext);
  const Theme = useColorScheme() != 'dark';
  const Alert = props.Alert;
  const Indicator = props.Indicator;
  const InputsY = useSharedValue(0)

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
      
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', e => {
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
                  <Text style={stylesDark.Text}>
                    Escribe tu ingreso mensual
                  </Text>
                  <MoneyInput
                    Style={Theme ? styles.MInputBudget : stylesDark.MInputBudget}
                    Value={Budget}
                    onValueChange={Value => {
                      setBudget(Value)
                    }}
                  ></MoneyInput>
                  <TouchableOpacity
                    style={Theme ? styles.ButtonReg : stylesDark.ButtonReg}
                    onPress={() => 
                      props.onOk(Budget)
                    }
                    activeOpacity={0.6}>
                    <Text
                      style={
                        Theme ? styles.ButtonRegText : stylesDark.ButtonRegText
                      }>
                      Ingresar
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
    top: Screen.height * 0.1,
    width: '80%',
    height: Screen.height * 0.3,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: Colors.DarkBackground,
    backgroundColor: Colors.DarkBackground2,
  },
  Text: {
    marginTop: '10%',
    marginHorizontal: '10%',
    fontSize: 25,
    color: Colors.White,
    textAlign: 'center',
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
    width: '35%',
    height: '20%',
    marginVertical: '5%',
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
  MInputBudget: {
    marginTop: '5%',
    width: '80%',
    height: '30%',
    color: Colors.White,
    backgroundColor: Colors.Gray,
    borderColor: Colors.Black,
    borderWidth: 3,
    borderRadius: 20,
    alignSelf: 'center'
  },
});
