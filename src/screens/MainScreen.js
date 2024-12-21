import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  useColorScheme,
  Text,
  Image,
} from 'react-native';
import Colors from '../const/Colors';
import {NavigationContext, useRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HorizontalBar from '../components/HorizontalBar';
import {GetUserInfo, SetUserInfo} from '../const/Functions';
import ModalBudget from './ModalBudget';
import CustumTable from '../components/CustumTable';
import Assets from '../const/Assets';

const Screen = Dimensions.get('screen');

export default function MainScreen(props) {
  //#region States
  const [UserData, setUserData] = useState(false);
  const [IsModal, setIsModal] = useState(false);
  const [BarValues, setBarValues] = useState([0]);
  const [BarColors, setBarColors] = useState([]);
  const [Budget, setBudget] = useState();
  const [Test, setTest] = useState();
  //#endregion

  // #region References
  const RefBudget = useRef();
  // #endregion

  //#region Other Variables
  const Nav = useContext(NavigationContext);
  const Route = useRoute();
  const Theme = useColorScheme() != 'dark';
  const Alert = props.Alert;
  const Indicator = props.Indicator;
  //#endregion

  //#region Animations

  //#endregion

  // #region Functions
  const SetNewBudget = async Value => {
    const UserI = await GetUserInfo();
    UserI.Data.Budget = Value;
    await SetUserInfo(UserI);
    setBarValues([Value]);
    setBarColors([Colors.White]);
  };
  // #endregion

  useEffect(() => {
    Nav.setOptions({
      headerShown: true,
      header: props => (
        <View
          style={{
            position: 'absolute',
            backgroundColor: Colors.Transparent,
            height: Screen.height * 0.05,
            width: Screen.width,
          }}>
          <TouchableHighlight
            style={{
              alignSelf: 'flex-end',
              borderRadius: 50,
              justifyContent: 'center',
              alignContent: 'center',
            }}
            onPress={/*() => Nav.openDrawer()*/ () => console.log(BarValues)}
            underlayColor={Colors.TransGray}>
            <MaterialCommunityIcons
              name="microsoft-xbox-controller-menu"
              color={Colors.DarkBackgroundLight}
              size={Screen.height * 0.05}
            />
          </TouchableHighlight>
        </View>
      ),
    });

    const FetchData = async () => {
      const UserI = await GetUserInfo();
      return UserI;
    };
    const UserI = FetchData().then(Data => {
      if (Data.Data) {
        setBudget(Number(Data.Data.Budget));
        let BarV = [];
        let BarC = [];
        BarV.push(Data.Data.Budget);
        BarC.push(Colors.White);
        setBarValues(BarV);
        setBarColors(BarC);
      } else {
        RefBudget.current.Show();
      }
      return;
    });
    return;
  }, []);
  return (
    <View
      style={
        Theme ? styles.ViewBackgroundBehind : stylesDark.ViewBackgroundBehind
      }>
      <View style={Theme ? styles.Container : stylesDark.Container}>
        <CustumTable
          style={stylesDark.StartTable}
          rows={2}
          columns={3}
          items={[
            <MaterialCommunityIcons
              name={'ab-testing'}
              size={80}
              >
            </MaterialCommunityIcons>,
            <MaterialCommunityIcons
              name={'abacus'}
              size={80}
              >
            </MaterialCommunityIcons>,
            <MaterialCommunityIcons
              name={'access-point-network'}
              size={80}
              >
            </MaterialCommunityIcons>,
            <MaterialCommunityIcons
              name={'account'}
              size={80}
              >
            </MaterialCommunityIcons>,
            <MaterialCommunityIcons
              name={'cash'}
              size={80}
              >
            </MaterialCommunityIcons>,
            <MaterialCommunityIcons
              name={'cat'}
              size={80}
              >
            </MaterialCommunityIcons>,
          ]}></CustumTable>
        <HorizontalBar
          style={Theme ? styles.HorizontalBar : stylesDark.HorizontalBar}
          values={BarValues}
          colors={BarColors}
        />
        <ModalBudget
          Ref={RefBudget}
          SetModal={setIsModal}
          Alert={Alert}
          onOk={SetNewBudget}
          Indicator={Indicator}></ModalBudget>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: Colors.DarkBackground,
  },
});
const stylesDark = StyleSheet.create({
  ViewBackgroundBehind: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.DarkBackground2,
  },
  Container: {
    margin: Screen.width * 0.05,
    width: Screen.width * 0.9,
    height: Screen.height - Screen.width * 0.1,
    borderRadius: 50,
    backgroundColor: Colors.DarkBackground,
  },
  ContainerBudget: {
    width: '100%',
    height: Screen.height * 0.35,
  },
  HorizontalBar: {
    width: '80%',
    height: '5%',
    marginTop: '5%',
    marginHorizontal: '10%',
    backgroundColor: Colors.Black,
    borderColor: Colors.LightBackground,
    mainBackgroundColor: Colors.DarkBackground,
  },
  VerticalBar: {
    width: '5%',
    height: '70%',
    marginTop: '10%',
    marginLeft: '10%',
    backgroundColor: Colors.Black,
    borderColor: Colors.LightBackground,
    mainBackgroundColor: Colors.DarkBackground,
  },
  StartTable: {
    marginVertical: '10%',
    
    width: '100%',
    height: '25%',
    borderRadius: 30,
  },
});
