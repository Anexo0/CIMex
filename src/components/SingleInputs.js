import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Colors from '../const/Colors';
import {ColorSpace} from 'react-native-reanimated';

export default function SingleInput(props) {
  const [Char, SetChar] = useState('');
  const [IsKeyboard, SetIsKeyboard] = useState(false);
  const Theme = useColorScheme() != 'dark';

  const SingleInputs = [0, 1, 2, 3, 4, 5, 7];
  const Refs = [];
  SingleInputs.map(i => {
    Refs.push(useRef());
  });

  const SIOnChangeText = (text, i) => {
    if (text) {
      props.setValue(props.value + text);
      Refs[i + 1].current.focus();
    }
  };
  const SIOnKeyPress = (e, i) => {
    if (e.nativeEvent.key == 'Backspace') {
      if (i == 0) {
        Refs[0].current.focus();
      } else {
        props.setValue(props.value.slice(0, i - 1));
        Refs[i - 1].current.focus();
      }
    }
  };

  const Style = Object.assign(
    {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    props.style,
  );

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      SetIsKeyboard(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', e => {
      setTimeout(() => {
        Refs.map(i => {
          i.current.blur();
        });
        SetIsKeyboard(false);
      }, 100);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View style={Style}>
      <View
        style={
          Theme
            ? styles.ViewSingleInputsSection
            : stylesDark.ViewSingleInputsSection
        }>
        {SingleInputs.slice(0, 3).map(i => (
          <TextInput
            key={i}
            ref={Refs[i]}
            keyboardType="number-pad"
            maxLength={1}
            caretHidden={!IsKeyboard}
            value={props.value.charAt(i)}
            style={Theme ? styles.SingleInput : stylesDark.SingleInput}
            onChangeText={text => {
              SIOnChangeText(text, i);
            }}
            onKeyPress={e => {
              SIOnKeyPress(e, i);
            }}
          />
        ))}
      </View>
      <View
        style={
          Theme
            ? styles.ViewSingleInputsSection
            : stylesDark.ViewSingleInputsSection
        }>
        {SingleInputs.slice(3, 6).map(i => (
          <TextInput
            key={i}
            ref={Refs[i]}
            keyboardType="number-pad"
            maxLength={1}
            caretHidden={!IsKeyboard}
            value={props.value.charAt(i)}
            style={Theme ? styles.SingleInput : stylesDark.SingleInput}
            onChangeText={text => {
              SIOnChangeText(text, i);
            }}
            onKeyPress={e => {
              SIOnKeyPress(e, i);
            }}
          />
        ))}
      </View>
      <TextInput
        style={{position: 'absolute', width: 0, height: 0}}
        caretHidden={true}
        ref={Refs[6]}
        keyboardType="number-pad"
        onKeyPress={e => {
          if (e.nativeEvent.key == 'Backspace') {
            Refs[5].current.focus();
            props.setValue(props.value.slice(0, 5));
          }
        }}></TextInput>
      <TouchableOpacity
        style={{position: 'absolute', width: '100%', height: '100%'}}
        onPress={() => {
          Refs[props.value.length].current.focus();
        }}></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  Input: {
    flex: 1,
    fontSize: 40,
    textAlign: 'center',
  },
  ViewSingleInputsSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  SingleInput: {
    width: '25%',
    height: 'auto',
    backgroundColor: Colors.DarkBackground,
    borderRadius: 10,
  },
});
const stylesDark = StyleSheet.create({
  Input: {
    flex: 1,
    fontSize: 40,
    textAlign: 'center',
  },
  ViewSingleInputsSection: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  SingleInput: {
    width: '25%',
    height: 'auto',
    backgroundColor: Colors.DarkBackground,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 40,
  },
});
