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
  const [macros, setMacros] = useState<{label:string, value:string, color:string}[]>([]);

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

            // 🔥 Calorías con Mifflin-St Jeor simplificada
            const edad = 20;
            let bmr = 0;
            if (generoUser === "Hombre") {
              bmr = 10 * peso + 6.25 * altura - 5 * edad + 5;
            } else {
              bmr = 10 * peso + 6.25 * altura - 5 * edad - 161;
            }
            const mantenimiento = Math.round(bmr * 1.55);

            const tabla = [
              { label: "Gran déficit", value: mantenimiento - 439, color: "#ff4d4d" },
              { label: "Déficit", value: mantenimiento - 204, color: "#ff9933" },
              { label: "Estable", value: mantenimiento, color: "#ffff66" },
              { label: "Volumen", value: mantenimiento + 216, color: "#66cc66" },
              { label: "Gran volumen", value: mantenimiento + 432, color: "#33cc33" }
            ];
            setCalorias(tabla);

            // 🔥 Macronutrientes y agua
            let proteinas = generoUser === "Hombre" ? peso * 1.8 : peso * 1.5;
            let carbohidratos = generoUser === "Hombre" ? peso * 4 : peso * 3.5;
            let grasas = generoUser === "Hombre" ? peso * 1 : peso * 0.8;
            let agua = generoUser === "Hombre" ? peso * 35 : peso * 30;

            const macrosList = [
              { label: "Proteínas", value: `${proteinas.toFixed(0)} g`, color: "#ff4d4d" }, // rojo
              { label: "Carbohidratos", value: `${carbohidratos.toFixed(0)} g`, color: "#33cc33" }, // verde
              { label: "Grasas saludables", value: `${grasas.toFixed(0)} g`, color: "#ffff66" }, // amarillo
              { label: "Agua", value: `${(agua/1000).toFixed(1)} L`, color: "#00ccff" } // celeste
            ];
            setMacros(macrosList);
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

      <View>
        <Text style={styles.title}>Cuadro calórico</Text>
      </View>
      <View style={styles.tableBox}>
        {calorias.map((c, idx) => (
          <View key={idx} style={[styles.column, {backgroundColor:c.color}]}>
            <Text style={styles.value}>{c.value} cal</Text>
            <Text style={styles.label}>{c.label}</Text>
          </View>
        ))}
      </View>

      {/* Listado de macros debajo con puntos de color */}
      <View style={styles.macrosBox}>
        <Text style={styles.title}>Macronutrientes y agua</Text>
        {macros.map((m, idx) => (
          <View key={idx} style={styles.macroRow}>
            <View style={[styles.dot, {backgroundColor:m.color}]} />
            <Text style={styles.macroItem}>{m.label}: {m.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5" },
  title: { fontSize:20, marginBottom:10, fontWeight:"bold" },
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
  value: { fontSize:14, fontWeight:"bold", color:"#000", marginBottom:5, textAlign:"center" },
  macrosBox: { marginTop:20, width:"90%", padding:10, backgroundColor:"#fff", borderRadius:8, borderWidth:1, borderColor:"#ccc" },
  macroRow: { flexDirection:"row", alignItems:"center", marginVertical:4 },
  dot: { width:12, height:12, borderRadius:6, marginRight:8 },
  macroItem: { fontSize:14, color:"#333" }
});
