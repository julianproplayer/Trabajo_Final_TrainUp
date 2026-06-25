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
  const [genero, setGenero] = useState<string>('');
  const [calorias, setCalorias] = useState<{label:string, value:number, color:string}[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const currentUserKey = await AsyncStorage.getItem('currentUser');
      if (currentUserKey) {
        const savedUser = await AsyncStorage.getItem(currentUserKey);
        if (savedUser) {
          const userObj = JSON.parse(savedUser);
          const peso = parseFloat(userObj.peso);
          const altura = parseFloat(userObj.altura);
          const generoUser = userObj.genero;
          setGenero(generoUser);

          if (peso && altura) {
            const imcCalc = peso / Math.pow(altura / 100, 2);
            setImc(Number(imcCalc.toFixed(2)));

            // 🔥 Calculadora calórica con Mifflin-St Jeor simplificada
            const edad = 20; // valor fijo para simplificar
            let bmr = 0;
            if (generoUser === "Hombre") {
              bmr = 10 * peso + 6.25 * altura - 5 * edad + 5;
            } else {
              bmr = 10 * peso + 6.25 * altura - 5 * edad - 161;
            }

            const mantenimiento = Math.round(bmr * 1.55); // factor actividad moderada

            const tabla = [
              { label: "Gran déficit", value: mantenimiento - 417, color: "#ff4d4d" },
              { label: "Déficit", value: mantenimiento - 204, color: "#ff9933" },
              { label: "Estable", value: mantenimiento, color: "#ffff66" },
              { label: "Volumen", value: mantenimiento + 216, color: "#66cc66" },
              { label: "Gran volumen", value: mantenimiento + 437, color: "#33cc33" }
            ];
            setCalorias(tabla);
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
        <Text style={styles.imc}>Tu IMC es: {imc} ({genero})</Text>
      )}

      {/* Cuadro con borde negro y columnas */}
      <View>
        <Text style={styles.title}>Cuadro calorico</Text>
      </View>
      <View style={styles.tableBox}>
        {calorias.map((c, idx) => (
          <View key={idx} style={[styles.column, {backgroundColor:c.color}]}>
            <Text style={styles.value}>{c.value} cal</Text>
            <Text style={styles.label}>{c.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5" },
  title: { fontSize:20, marginBottom:20, fontWeight:"bold" },
  imc: { fontSize:16, marginBottom:20 },
  tableBox: { 
    flexDirection:"row", 
    justifyContent:"space-between", 
    width:"95%", 
    borderWidth:2, 
    borderColor:"#000", 
    borderRadius:8, 
    padding:5 
  },
  column: { 
    flex:1, 
    marginHorizontal:3, 
    padding:10, 
    alignItems:"center", 
    borderRightWidth:1, 
    borderColor:"#000" 
  },
  label: { fontSize:10.66, fontWeight:"600", color:"#000", textAlign:"center", flexWrap:"nowrap" },
  value: { fontSize:14, fontWeight:"bold", color:"#000", marginBottom:5, textAlign:"center" }
});
