import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, BackHandler, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation';

type NutricionScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Nutrición'>;

type Props = {
  navigation: NutricionScreenNavigationProp;
}

export default function NutricionScreen({ navigation }: Props) {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [imc, setImc] = useState<number | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUserKey = await AsyncStorage.getItem('currentUser');
      if (currentUserKey) {
        const savedUser = await AsyncStorage.getItem(currentUserKey);
        if (savedUser) {
          const userObj = JSON.parse(savedUser);
          const peso = parseFloat(userObj.peso);
          const altura = parseFloat(userObj.altura);
          if (peso && altura) {
            const imcCalc = peso / Math.pow(altura / 100, 2);
            setImc(Number(imcCalc.toFixed(2))); // redondear a 2 decimales
          }
        }
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (backPressedOnce) {
        BackHandler.exitApp();
        return true;
      } else {
        setBackPressedOnce(true);
        ToastAndroid.show("Toca atrás otra vez para salir", ToastAndroid.SHORT);
        setTimeout(() => setBackPressedOnce(false), 2000)
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();   
  }, [backPressedOnce]); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan de nutrición 🍎</Text>
      {imc !== null && (
        <Text style={styles.imc}>Tu IMC es: {imc}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5" },
  title: { fontSize:20, marginBottom:30 },
  imc: { fontSize:18, fontWeight:"bold", color:"#333" }
});
