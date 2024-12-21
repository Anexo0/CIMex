import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Dimensions,
} from 'react-native';
import BottomTabs from './BottomTabs';

const Screen = Dimensions.get('screen');

const CustomSideDrawer = props => {
  const Nav = props.navigation;
  const Params = props.state.routes[0].params;
  const RouteNames = props.state.routeNames;
  var RouteButtons = [];
  RouteNames.forEach((element, i) => {
    RouteButtons.push(
      <TouchableOpacity
        key={i}
        style={stylesDrawer.TButtonItem}
        onPress={() => {
          Nav.navigate(element);
        }}>
        <Text style={stylesDrawer.TextItem}>{element}</Text>
      </TouchableOpacity>,
    );
  });
  return (
    <SafeAreaView style={stylesDrawer.SViewDrawer}>
      <Text style={stylesDrawer.TextName}>{`Bienvenido\n Alexis`}</Text>
      <View>{RouteButtons}</View>
    </SafeAreaView>
  );
};

export default class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.Alert = this.props.Alert;
  }

  render() {
    const Drawer = createDrawerNavigator();
    return (
      <Drawer.Navigator
        screenOptions={{headerShown: false}}
        drawerContent={props => <CustomSideDrawer {...props} />}>
        <Drawer.Screen name="First">
          {props => <BottomTabs Alert={this.ShowAlert} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    );
  }
}

const styles = StyleSheet.create({});

const stylesDrawer = StyleSheet.create({
  SViewDrawer: {
    flex: 1,
  },
  TextName: {
    marginTop: '5%',
    color: '#000000',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
  TextItem: {
    height: Screen.height * 0.05,
    paddingLeft: '5%',
    fontSize: 20,
    textAlignVertical: 'center',
    color: '#000000',
  },
  TButtonItem: {
    marginHorizontal: '5%',
    marginVertical: '3%',
    borderColor: '#000000',
    borderWidth: 3,
    borderRadius: 20,
  },
});
