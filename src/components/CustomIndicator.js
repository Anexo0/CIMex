import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../const/Colors';
import Animated, {
  FadeIn,
  FadeOut,
  LightSpeedInLeft,
  LightSpeedOutRight,
  ReduceMotion,
} from 'react-native-reanimated';

const Screen = Dimensions.get('window');

export default function CustomIndicator(props) {
  const Theme = useColorScheme() != 'dark';

  // #region States
  const [Shown, SetShown] = useState(false);
  const [isAnimated, SetIsAnimated] = useState(false);
  const [Descrption, SetDescrption] = useState(false);
  const [Title, SetTitle] = useState(false);
  // #endregion

  // #region Functions
  const Show = ({Title = '', Description = ''} = {}) => {
    SetShown(true);
    SetIsAnimated(true);
    SetTitle(Title);
    SetDescrption(Description);
  };
  const Close = () => {
    SetShown(false);
    setTimeout(() => {
      SetIsAnimated(false);
    }, 500);
  };
  // #endregion

  useEffect(() => {
    if (props.Ref) {
      props.Ref.current = {
        Show: Show,
        Close: Close,
      };
    }
  }, []);
  return (
    <View style={styles.Container}>
      {isAnimated && (
        <Animated.View
          style={[isAnimated ? styles.Background : null]}
          entering={FadeIn.reduceMotion(ReduceMotion.Never)}
          exiting={FadeOut.reduceMotion(ReduceMotion.Never)}>
          {Shown && (
            <Animated.View
              style={[{flex: 1}]}
              entering={LightSpeedInLeft.reduceMotion(
                ReduceMotion.Never,
              ).duration(1000)}
              exiting={LightSpeedOutRight.reduceMotion(
                ReduceMotion.Never,
              ).duration(1000)}>
              <View style={Theme ? styles.AIView : stylesDark.AIContainer}>
                <ActivityIndicator
                  style={
                    Theme ? styles.AILoginLoading : stylesDark.AILoginLoading
                  }
                  size={Screen.height * 0.1}
                  animating={Shown}
                  color={
                    Theme
                      ? Colors.LightBackgroundLight
                      : Colors.DarkBackgroundLight
                  }
                />
                <Text style={Theme ? styles.TextTitle : stylesDark.TextTitle}>
                  {Title}
                </Text>
                <Text
                  style={
                    Theme ? styles.TextDescription : stylesDark.TextDescription
                  }>
                  {Descrption}
                </Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    position: 'absolute',
    width: Screen.width,
    height: Screen.height,
  },
  Background: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.TransGray,
  },
  AIView: {
    position: 'absolute',
    top: Screen.height * 0.3,
    left: Screen.width * 0.25,
    height: Screen.height * 0.25,
    width: Screen.width * 0.5,
    backgroundColor: Colors.LightBackground2,
    borderColor: Colors.LightBackground,
    borderWidth: 5,
    borderRadius: 25,
  },
  AILoginLoading: {
    marginTop: '1%',
  },
  TextTitle: {
    width: '100%',
    height: '25%',
    textAlignVertical: 'center',
    textAlign: 'center',
    color: Colors.Black,
    fontSize: 25,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  TextDescription: {
    width: '90%',
    height: '25%',
    marginHorizontal: '5%',
    textAlign: 'center',
    color: Colors.Gray,
    fontSize: 20,
  },
});
const stylesDark = StyleSheet.create({
  AIContainer: {
    position: 'absolute',
    top: Screen.height * 0.3,
    left: Screen.width * 0.25,
    height: Screen.height * 0.25,
    width: Screen.width * 0.5,
    backgroundColor: Colors.DarkBackground2,
    borderColor: Colors.DarkBackground,
    borderWidth: 5,
    borderRadius: 25,
  },
  AILoginLoading: {
    marginTop: '1%',
  },
  TextTitle: {
    width: '100%',
    height: '20%',
    textAlignVertical: 'center',
    textAlign: 'center',
    color: Colors.White,
    fontSize: 25,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  TextDescription: {
    width: '90%',
    height: '30%',
    marginHorizontal: '5%',
    textAlign: 'center',
    color: Colors.OffWhite,
    fontSize: 20,
  },
});
