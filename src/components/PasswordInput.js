import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Easing,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../const/Colors';
import Animated, {
  BounceIn,
  BounceInUp,
  FadeIn,
  FadeOut,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Constants} from '../const/Constants';

const Screen = Dimensions.get('window');

export default function PasswordInput(props) {
  const Theme = useColorScheme() == 'dark';

  // #region States
  const [ShowPassw, SetShowPassw] = useState(true);
  const [IsError, SetIsError] = useState(false);
  const [ErrorText, SetErrorText] = useState('');
  // #endregion

  // #region Other
  const Container = Object.assign({}, props.Style);
  const PasswInput = {
    width: '85%',
    height: '100%',
    paddingLeft: '5%',
    color: props.Style.color,
    fontSize: props.Style.fontSize,
  };
  const Icon = ['eye', 'eye-off'];
  const IconDark = ['eye-outline', 'eye-off-outline'];
  const PassX = useSharedValue(0);

  const PassAnimation = useAnimatedStyle(() => ({
    transform: [{rotateZ: `${PassX.value}deg`}],
  }));
  // #endregion

  // #region Functions
  const ShowError = (Text = '') => {
    SetIsError(true);
    SetErrorText(Text);
    PassX.value = withSequence(
      withTiming(-1, {duration: 100 / 2, reduceMotion: ReduceMotion.Never}),
      withRepeat(
        withTiming(1, {
          duration: 100,
          reduceMotion: ReduceMotion.Never,
        }),
        10,
        true,
        null,
        ReduceMotion.Never,
      ),
      withTiming(0, {duration: 100 / 2, reduceMotion: ReduceMotion.Never}),
    );
  };
  const RemoveError = () => {
    SetIsError(false);
  };
  // #endregion

  useEffect(() => {
    if (props.Ref) {
      Object.assign(props.Ref.current, {
        ShowError: ShowError,
        RemoveError: RemoveError,
      });
    }
  }, []);

  return (
    <Animated.View style={[Container, PassAnimation]}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <TextInput
          style={PasswInput}
          value={props.Value}
          textContentType="password"
          secureTextEntry={ShowPassw}
          ref={props.Ref}
          blurOnSubmit={!props.NextRef}
          onChangeText={text => {
            props.onChangeText(text)
            RemoveError()
          }}
          onSubmitEditing={() => {
            try {
              props.NextRef.current.focus();
            } catch (Error) {}
          }}></TextInput>
        <TouchableOpacity
          style={styles.Button}
          activeOpacity={0.5}
          onPress={() => {
            SetShowPassw(!ShowPassw);
          }}>
          <MaterialCommunityIcons
            size={Dimensions.get('window').scale * 8}
            name={
              Theme ? Icon[Number(ShowPassw)] : IconDark[Number(ShowPassw)]
            }></MaterialCommunityIcons>
        </TouchableOpacity>
      </View>
      {IsError && (
        <Animated.View
          style={[styles.ErrorView]}
          entering={FadeIn.duration(500).reduceMotion(ReduceMotion.Never)}
          exiting={FadeOut.reduceMotion(ReduceMotion.Never)}>
          <Text style={styles.ErrorText}>{ErrorText}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  Button: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ErrorText: {
    width: '100%',
    height: '100%',
    color: Colors.RedInputErrorDark,
    textAlign: 'center',
    textAlignVertical: 'bottom',
  },
  ErrorView: {
    position: 'absolute',
    top: '60%',
    height: '35%',
    width: '100%',
    alignItems: 'flex-end',
  },
});
