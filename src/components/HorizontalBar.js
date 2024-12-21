import {View, Text, useColorScheme, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {NavigationContext} from '@react-navigation/native';
import Colors from '../const/Colors';
import {RNHoleView} from 'react-native-hole-view';
import {longPressGestureHandlerProps} from 'react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler';

export default function HorizontalBar(props) {
  //#region States
  const [ParentDimensions, SetParentHeight] = useState();
  //#endregion

  //#region Other
  //#endregion

  // #region Styles
  let Container = Object.assign(
    {
      flexDirection: 'row',
    },
    props.style,
  );

  let ContainerBar = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.Transparent,
    borderColor: props.style.borderColor,
    borderWidth: 3,
    borderRadius: 40,
  };
  // #endregion

  //#region Animations

  //#endregion

  // #region Calculations
  const TextMid = Object.assign({}, styles.TextMiddle);
  TextMid.fontSize = ParentDimensions ? ParentDimensions.height * 0.7 : 0;
  TextMid.top = ParentDimensions ? -ParentDimensions.height * 0.8 : 0;
  if (TextMid.fontSize > 30) {
    TextMid.fontSize = 30;
  }

  const Values = !props.values ? false : props.values;
  const ValuesColors = props.colors;

  const TotalV = Values ? Values.reduce((a, x) => a + x) : null;
  const Percents = Values
    ? Values.map(x => Number((100 / (TotalV / x)).toFixed(2)))
    : null;
  const PercentsString = Values ? Percents.map(x => x + '%') : [];
  const PercentsAcum = Values
    ? Percents.map((x, i) => {
        const Acum = Percents.slice(0, i + 1).reduce((a, x) => a + x);
        return Acum.toFixed(2) + '%';
      })
    : [];

  let Wasted = Number(0.0).toFixed(2);
  // #endregion

  useEffect(() => {}, []);

  return (
    <View
      style={Container}
      onLayout={e => {
        SetParentHeight({
          height: e.nativeEvent.layout.height,
          width: e.nativeEvent.layout.width,
        });
      }}>
      {Values &&
        PercentsString.map((x, i) => {
          if (i == 0) {
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  height: '100%',
                  width: PercentsString[i],
                  backgroundColor:
                    ValuesColors && ValuesColors[i]
                      ? ValuesColors[i]
                      : Colors.Transparent,
                }}></View>
            );
          }
          if (i == Percents.length - 1) {
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  height: '100%',
                  left: PercentsAcum[i - 1],
                  width: PercentsString[i],
                  backgroundColor:
                    ValuesColors && ValuesColors[i]
                      ? ValuesColors[i]
                      : Colors.Transparent,
                }}></View>
            );
          }
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                height: '100%',
                left: PercentsAcum[i - 1],
                width: PercentsString[i],
                backgroundColor:
                  ValuesColors && ValuesColors[i]
                    ? ValuesColors[i]
                    : Colors.Transparent,
              }}></View>
          );
        })}
      <View style={ContainerBar}></View>
      <Text style={TextMid}>
        {`${Number(Wasted).toLocaleString()} / ${Number(
          TotalV,
        ).toLocaleString()}`}
      </Text>
      <RNHoleView
        style={{flex: 1, backgroundColor: props.style.mainBackgroundColor}}
        holes={[
          {
            x: 0,
            y: 0,
            width: ParentDimensions ? ParentDimensions.width : 0,
            height: ParentDimensions ? ParentDimensions.height : 0,
            borderRadius: 40,
          },
        ]}></RNHoleView>
    </View>
  );
}

const styles = StyleSheet.create({
  TextMiddle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    textAlign: 'center',
    color: Colors.White,
    fontSize: 0,
    fontWeight: 'bold',
  },
});
