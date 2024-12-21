import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {Component, createContext, useSyncExternalStore} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationContext} from '@react-navigation/native';
import MainScreen from '../screens/MainScreen';
import Test from '../screens/Test';

const Screen = Dimensions.get('screen');

export default class BottomTabs extends Component {
  static contextType = NavigationContext;
  constructor(props) {
    super(props);
    this.state = {};
    this.Alert = this.props.Alert;
  }

  render() {
    const Tabs = createBottomTabNavigator();
    const Nav = this.context;
    return (
      <Tabs.Navigator
        initialRouteName="Main"
        screenOptions={{headerShown: false}}>
        <Tabs.Screen
          name="Main"
          options={{
            tabBarLabel: 'Inicio',
            tabBarLabelStyle: {
              color: '#000000',
              fontSize: 15,
              fontWeight: 'bold',
            },
            tabBarActiveBackgroundColor: '#32a8bc75',
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="border-all-variant"
                color="#2e59f4"
                size={26}
              />
            ),
          }}>
          {props => <Test Alert={this.ShowAlert} />}
        </Tabs.Screen>
      </Tabs.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  TouchButton: {
    marginHorizontal: '20%',
    backgroundColor: '#000000',
  },
  TouchText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
});
