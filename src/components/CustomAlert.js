import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  Appearance,
  useColorScheme,
} from 'react-native';
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Colors from '../const/Colors';
import Animated, {
  FadeIn,
  FadeOut,
  ReduceMotion,
  SlideInUp,
  SlideOutUp,
} from 'react-native-reanimated';

const Screen = Dimensions.get('window');

export default function CustomAlert(props) {
  const Theme = useColorScheme() != 'dark';

  // #region States
  const [Alert, setAlert] = useState(false);
  const [Alert2B, setAlert2B] = useState(false);
  const [AlertTitle, setAlertTitle] = useState('');
  const [AlertDescription, setAlertDescription] = useState('');

  const [IsBack, setIsBack] = useState(false);
  const [IsAlert, setIsAlert] = useState(false);

  const [AlertBText, setAlertBText] = useState('');
  const [Alert2BText, setAlert2BText] = useState('');
  // #endregion

  // #region Functions
  const Show1B = ({
    Title = '',
    Description = '',
    Show = true,
    ButtonText = 'Ok',
    CallBack = null,
  } = {}) => {
    setAlert(Show);
    setIsBack(Show);
    setAlertTitle(Title);
    setAlertDescription(Description);
    setAlertBText(ButtonText);

    if (CallBack) {
      props.Ref.current = Object.assign(props.Ref.current, {
        CallBack1: CallBack,
      });
    }

    setTimeout(() => {
      setIsAlert(true);
    }, 100);
  };

  const Show2B = ({
    Title = '',
    Description = '',
    Show = true,
    ButtonText = 'Si',
    Button2Text = 'No',
    CallBack1 = null,
    CallBack2 = null,
  } = {}) => {
    setAlert(Show);
    setIsBack(Show);
    setAlert2B(Show);

    setAlertTitle(Title);
    setAlertDescription(Description);

    setAlertBText(ButtonText);
    setAlert2BText(Button2Text);

    if (CallBack1) {
      props.Ref.current = Object.assign(props.Ref.current, {
        CallBack1: CallBack1,
      });
    }
    if (CallBack2) {
      props.Ref.current = Object.assign(props.Ref.current, {
        CallBack2: CallBack2,
      });
    }

    setTimeout(() => {
      setIsAlert(true);
    }, 100);
  };

  const CloseAlert = () => {
    setTimeout(() => {
      setAlert(false);
      setAlert2B(false);
    }, 500);
    setTimeout(() => {
      setIsBack(false);
    }, 250);
    setIsAlert(false);
  };
  // #endregion

  useEffect(() => {
    if (props.Ref) {
      props.Ref.current = {
        Show1B: Show1B,
        Show2B: Show2B,
        CloseAlert: CloseAlert,
        CallBack1: null,
        CallBack2: null,
      };
    }
  }, []);

  return (
    <GestureHandlerRootView style={Alert ? styles.Container : null}>
      {IsBack && (
        <Animated.View
          style={[styles.Background]}
          entering={FadeIn.reduceMotion(ReduceMotion.Never)}
          exiting={FadeOut.reduceMotion(ReduceMotion.Never)}>
          <TouchableOpacity onPress={CloseAlert}>
            {IsAlert && (
              <Animated.View
                style={[Theme ? styles.ViewAlert : stylesDark.ViewAlert]}
                entering={SlideInUp.duration(500).reduceMotion(
                  ReduceMotion.Never,
                )}
                exiting={SlideOutUp.duration(500).reduceMotion(
                  ReduceMotion.Never,
                )}>
                <TouchableWithoutFeedback>
                  <Text style={Theme ? styles.TextTitle : stylesDark.TextTitle}>
                    {AlertTitle}
                  </Text>
                  <Text
                    style={
                      Theme
                        ? styles.TextDescription
                        : stylesDark.TextDescription
                    }>
                    {AlertDescription}
                  </Text>
                  <View style={styles.ContainerButtons}>
                    <TouchableOpacity
                      style={Theme ? styles.Button : stylesDark.Button}
                      onPress={() => {
                        if (props.Ref.current.CallBack1) {
                          props.Ref.current.CallBack1();
                        }
                        CloseAlert();
                      }}>
                      <Text
                        style={
                          Theme ? styles.TextButton : stylesDark.TextButton
                        }>
                        {AlertBText}
                      </Text>
                    </TouchableOpacity>
                    {Alert2B && (
                      <TouchableOpacity
                        style={Theme ? styles.Button : stylesDark.Button}
                        onPress={() => {
                          if (props.Ref.current.CallBack2) {
                            props.Ref.current.CallBack2();
                          }
                          CloseAlert();
                        }}>
                        <Text
                          style={
                            Theme ? styles.TextButton : stylesDark.TextButton
                          }>
                          {Alert2BText}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  Container: {
    position: 'absolute',
    top: 0,
    height: Screen.height,
    width: Screen.width,
  },
  ContainerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  Background: {
    width: Screen.width,
    height: Screen.height,
    backgroundColor: Colors.AlertTransGray,
  },
  ViewAlert: {
    position: 'absolute',
    top: Screen.height * 0.35,
    left: Screen.width * 0.1,
    width: Screen.width * 0.8,
    height: Screen.height * 0.3,
    backgroundColor: Colors.LightBackground,
    borderColor: Colors.LightBackground2,
    borderWidth: 5,
    borderRadius: 20,
  },
  TextTitle: {
    width: Screen.width * 0.7,
    marginTop: Screen.height * 0.01,
    marginLeft: Screen.width * 0.05,
    color: Colors.Black,
    fontSize: 25,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  TextDescription: {
    width: Screen.width * 0.64,
    height: Screen.height * 0.17,
    marginTop: Screen.height * 0.01,
    marginLeft: Screen.width * 0.08,
    color: Colors.Gray,
    fontSize: 20,
  },
  Button: {
    width: Screen.width * 0.15,
    height: Screen.height * 0.05,
    marginTop: Screen.height * 0.001,
    justifyContent: 'center',
    backgroundColor: Colors.LightBackground2,
    borderWidth: 2,
    borderRadius: 15,
  },
  TextButton: {
    color: Colors.Black,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

const stylesDark = StyleSheet.create({
  Background: {
    width: Screen.width,
    height: Screen.height,
    backgroundColor: Colors.AlertTransGray,
  },
  ViewAlert: {
    position: 'absolute',
    top: Screen.height * 0.35,
    left: Screen.width * 0.1,
    width: Screen.width * 0.8,
    height: Screen.height * 0.3,
    backgroundColor: Colors.DarkBackground,
    borderColor: Colors.DarkBackground2,
    borderWidth: 5,
    borderRadius: 20,
  },
  TextTitle: {
    width: Screen.width * 0.7,
    marginTop: Screen.height * 0.01,
    marginLeft: Screen.width * 0.05,
    color: Colors.White,
    fontSize: 25,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  TextDescription: {
    width: Screen.width * 0.64,
    height: Screen.height * 0.17,
    marginTop: Screen.height * 0.01,
    marginLeft: Screen.width * 0.08,
    color: Colors.OffWhite,
    fontSize: 20,
  },
  Button: {
    width: Screen.width * 0.15,
    height: Screen.height * 0.05,
    marginTop: Screen.height * 0.001,
    justifyContent: 'center',
    backgroundColor: Colors.Gray,
    borderWidth: 2,
    borderRadius: 15,
  },
  TextButton: {
    color: Colors.White,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
