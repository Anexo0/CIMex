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
import Colors from '../const/Colors';
import Animated, {
  FadeIn,
  FadeOut,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const Screen = Dimensions.get('window');

export default function MoneyInput(props) {
  const Theme = useColorScheme() == 'dark';

  // #region States
  const [IsError, SetIsError] = useState(false);
  const [ErrorText, SetErrorText] = useState('');
  const [InputNumber, setInputNumber] = useState('')
  const [Number, setNumber] = useState('0.00')
  const [ContainerHeight, setContainerHeight] = useState(0)
  // #endregion

  // #region Other
  const InputStyle = {
    width: '100%',
    height: '100%',
    color: Colors.Transparent,
    backgroundColor: Colors.Transparent,
    fontSize: ContainerHeight*0.75,
    textAlign: 'center',
    textAlignVertical: 'center'
  };
  const NumberStyle = JSON.parse(JSON.stringify(InputStyle))
  NumberStyle.position = 'absolute'
  NumberStyle.color = Colors.White
  NumberStyle.padding = 0
  const Container = Object.assign({}, props.Style);
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
    <Animated.View style={[Container, PassAnimation]}
    onLayout={(event) => {
      setContainerHeight(event.nativeEvent.layout.height)
    }}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <Text style={NumberStyle}>
          {`$${Number}`}
        </Text>
        <TextInput
          style={InputStyle}
          value={InputNumber}
          caretHidden={true}
          inputMode='numeric'
          ref={props.Ref}
          blurOnSubmit={!props.NextRef}
          onChangeText={text => {
            setInputNumber(text)
            let TextArray = text.split("")
            if (TextArray.length > 2) {
              TextArray.splice(TextArray.length-2,0,".")
            } else {
              for (let i = TextArray.length; i < 3; i++) {
                if (i==2) {
                  TextArray.unshift(".")
                }
                TextArray.unshift("0")
              }
            }
            let NewNumber = TextArray.join("")
            setNumber(NewNumber)
            props.onValueChange(NewNumber)
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
            ShowError('Error');
          }}></TouchableOpacity>
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
    top: '65%',
    height: '35%',
    width: '100%',
    alignItems: 'flex-end',
  },
});
