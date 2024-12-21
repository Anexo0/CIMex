import {View, Text, useColorScheme, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';
import {NavigationContext} from '@react-navigation/native';
import Colors from '../const/Colors';
import {RNHoleView} from 'react-native-hole-view';

export default function VerticalBar(props) {
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
  const Values = props.values;
  const ValuesColors = props.colors;
  const Total = Values.reduce((a, x) => a + x);
  const Percents = Values.map(x => Number((100 / (Total / x)).toFixed(2)));
  const PercentsString = Percents.map(x => x + '%');
  const PercentsAcum = Percents.map((x, i) => {
    const Acum = Percents.slice(0, i + 1).reduce((a, x) => a + x);
    return Acum.toFixed(2) + '%';
  });

  return (
    <View
      style={Container}
      onLayout={e => {
        SetParentHeight({
          height: e.nativeEvent.layout.height,
          width: e.nativeEvent.layout.width,
        });
      }}>
      {PercentsString.map((x, i) => {
        if (i == 0) {
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: PercentsString[i],
                backgroundColor: ValuesColors[i]
                  ? ValuesColors[i]
                  : Colors.Gray,
              }}></View>
          );
        }
        if (i == Percents.length - 1) {
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: '100%',
                top: PercentsAcum[i - 1],
                height: PercentsString[i],
                backgroundColor: ValuesColors[i]
                  ? ValuesColors[i]
                  : Colors.Gray,
              }}></View>
          );
        }
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: '100%',
              top: PercentsAcum[i - 1],
              height: PercentsString[i],
              backgroundColor: ValuesColors[i] ? ValuesColors[i] : Colors.Gray,
            }}></View>
        );
      })}
      <View style={ContainerBar}></View>
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

const styles = StyleSheet.create({});
