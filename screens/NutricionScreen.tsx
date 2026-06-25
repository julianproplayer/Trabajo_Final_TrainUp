import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, BackHandler, ToastAndroid, ScrollView } from 'react-native';
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
              { label: "Proteínas", value: `${proteinas.toFixed(0)} g`, color: "#ff4d4d" },
              { label: "Carbohidratos", value: `${carbohidratos.toFixed(0)} g`, color: "#33cc33" },
              { label: "Grasas saludables", value: `${grasas.toFixed(0)} g`, color: "#ffff66" },
              { label: "Agua", value: `${(agua/1000).toFixed(1)} L`, color: "#00ccff" }
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Plan de nutrición 🍎</Text>
        {imc !== null && (
          <Text style={styles.imc}>Tu IMC es: {imc} ({genero})</Text>
        )}

        <Text style={styles.title}>Cuadro calórico</Text>
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

        {/* Alimentos recomendados */}
        <View style={styles.foodBox}>
          <Text style={styles.title}>Alimentos recomendados (origen animal)</Text>
          <Text style={styles.foodItem}>🐔 Pechuga de pollo (100 g) — 165 kcal</Text>
          <Text style={styles.foodItem}>🥩 Carne vacuna magra (100 g) — 250 kcal</Text>
          <Text style={styles.foodItem}>🐟 Salmón (100 g) — 208 kcal</Text>
          <Text style={styles.foodItem}>🥚 Huevo (50 g, 1 unidad) — 70 kcal</Text>
          <Text style={styles.foodItem}>🥛 Yogur natural (100 g) — 60 kcal</Text>
          <Text style={styles.foodItem}>🧀 Queso fresco (50 g) — 130 kcal</Text>
        </View>
        <View style={styles.foodBox}>
          <Text style={styles.title}>Cereales y tubérculos</Text>
          <Text style={styles.foodItem}>🍚 Arroz (100 g cocido) — 130 kcal</Text>
          <Text style={styles.foodItem}>🥔 Papa (100 g cocida) — 77 kcal</Text>
          <Text style={styles.foodItem}>🌽 Maíz (100 g) — 96 kcal</Text>
          <Text style={styles.foodItem}>🍞 Pan integral (50 g) — 120 kcal</Text>
          <Text style={styles.foodItem}>🌾 Avena (50 g) — 190 kcal</Text>
          <Text style={styles.foodItem}>🍠 Batata (100 g) — 86 kcal</Text>
        </View>
        <View style={styles.foodBox}>
          <Text style={styles.title}>Verduras</Text>
          <Text style={styles.foodItem}>🥦 Brócoli (100 g) — 34 kcal</Text>
          <Text style={styles.foodItem}>🥕 Zanahoria (100 g) — 41 kcal</Text>
          <Text style={styles.foodItem}>🥬 Espinaca (100 g) — 23 kcal</Text>
          <Text style={styles.foodItem}>🍅 Tomate (100 g) — 18 kcal</Text>
        </View>
        <View style={styles.foodBox}>
          <Text style={styles.title}>Frutas</Text>
           <Text style={styles.foodItem}>🍎 Manzana (100 g) — 52 kcal</Text>
          <Text style={styles.foodItem}>🍌 Banana (100 g) — 89 kcal</Text>
          <Text style={styles.foodItem}>🍊 Naranja (100 g) — 47 kcal</Text>
          <Text style={styles.foodItem}>🍇 Uvas (100 g) — 69 kcal</Text>
        </View>
        <View style={styles.foodBox}>
          <Text style={styles.title}>Legumbres</Text>
          <Text style={styles.foodItem}>🌱 Lentejas (100 g cocidas) — 116 kcal</Text>
          <Text style={styles.foodItem}>🫘 Garbanzos (100 g cocidos) — 164 kcal</Text>
        </View>
        <View style={styles.foodBox}>
          <Text style={styles.title}>Permitidos (De manera ocasional)</Text>
          <Text style={styles.foodItem}>🍫 Chocolate negro (20 g) — 110 kcal</Text>
          <Text style={styles.foodItem}>🍪 Galleta simple (25 g) — 120 kcal</Text>
          <Text style={styles.foodItem}>🥧 Porción pequeña de torta (50 g) — 180 kcal</Text>
          <Text style={styles.foodItem}>🍯 Miel (15 g, 1 cucharada) — 50 kcal</Text>
          <Text style={styles.foodItem}>🍦 Helado (50 g, 1 bola) — 100 kcal</Text>
          <Text style={styles.foodItem}>🥤 Bebida azucarada (150 ml) — 60 kcal</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 40 },
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5", padding:10 },
  title: { fontSize:20, marginBottom:10, fontWeight:"bold", textAlign:"center" },
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
  label: { fontSize:12, fontWeight:"600", color:"#000", textAlign:"center", flexWrap:"nowrap" },
  value: { fontSize:14, fontWeight:"bold", color:"#000", marginBottom:5, textAlign:"center" },
  macrosBox: { marginTop:20, width:"90%", padding:10, backgroundColor:"#fff", borderRadius:8, borderWidth:1, borderColor:"#ccc" },
  macroRow: { flexDirection:"row", alignItems:"center", marginVertical:4 },
  dot: { width:12, height:12, borderRadius:6, marginRight:8 },
  macroItem: { fontSize:14, color:"#333" },
  foodBox: { marginTop:20, width:"90%", padding:10, backgroundColor:"#fff", borderRadius:8, borderWidth:1, borderColor:"#ccc" },
  foodItem: { fontSize:14, marginVertical:4, color:"#333" }
});
