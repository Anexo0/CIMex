import {NavigationContainer} from '@react-navigation/native';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import React, {useRef} from 'react';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import CustomAlert from '../components/CustomAlert';
import CustomIndicator from '../components/CustomIndicator';
import {Dimensions} from 'react-native';

const Screen = Dimensions.get('window');

export default function Navigation() {
  const RefAlert = useRef();
  const RefIndicator = useRef();
  const Stack = createStackNavigator();



  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login">
          {props => <LoginScreen Alert={RefAlert} Indicator={RefIndicator} />}
        </Stack.Screen>
        <Stack.Screen
          name="Main" options={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}} initialParams={{Email:"alexisulisesperez@gmail.co"}}>
          {props => <MainScreen Alert={RefAlert} Indicator={RefIndicator} />}
        </Stack.Screen>
      </Stack.Navigator>
      <CustomAlert Ref={RefAlert} />
      <CustomIndicator Ref={RefIndicator} />
    </NavigationContainer>
  );
}
