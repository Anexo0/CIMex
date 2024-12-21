import {View, Text} from 'react-native';
import React, {useState} from 'react';

export default function CustumTable(props) {
  const [ParentDimensions, SetParentHeight] = useState();
  let Style = Object.assign({}, props.style)
  let TableItems = [];
  if (ParentDimensions) {
    let ItemHeight = ParentDimensions.height / props.rows;
    let ItemWidth = ParentDimensions.width / props.columns;
    for (let x = 0; x < props.rows; x++) {
      let RowItems = [];
      for (let y = 0; y < props.columns; y++) {
        RowItems.push(
          <View
            key={x*props.columns+y}
            style={{
              height: ItemHeight,
              width: ItemWidth,
              justifyContent: 'center',
              alignItems: 'center',
            }}>{props.items[x*props.columns+y]}</View>,
        );
      }
      TableItems.push(
        <View
          key={(x+1)*10}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: ItemHeight,
            width: ParentDimensions.width,
          }}>
          {RowItems}
        </View>,
      );
    }
  }
  Style.padding = 0

  return (
    <View
      style={Style}
      onLayout={e => {
        SetParentHeight({
          height: e.nativeEvent.layout.height,
          width: e.nativeEvent.layout.width,
        });
      }}>
      {TableItems ? TableItems : null}
    </View>
  );
}
