import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, ToastAndroid, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation';

type NutricionScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Nutrición'>;

type Props = {
  navigation: NutricionScreenNavigationProp;
}

// 📦 Banco de alimentos (10 opciones por categoría para simular el 1/10 de probabilidad)
const FOOD_POOL = {
  animal: [
    "🐔 Pechuga de pollo (100 g) — 165 kcal",
    "🥩 Carne vacuna magra (100 g) — 250 kcal",
    "🐟 Salmón (100 g) — 208 kcal",
    "🥚 Huevo (50 g, 1 unidad) — 70 kcal",
    "🥛 Yogur natural (100 g) — 60 kcal",
    "🧀 Queso fresco (50 g) — 130 kcal",
    "🐟 Atún en agua (100 g) — 116 kcal",
    "🥩 Pechuga de Pavo (100 g) — 135 kcal",
    "🍤 Camarones (100 g) — 99 kcal",
    "🥛 Leche descremada (200 ml) — 90 kcal"
  ],
  cereales: [
    "🍚 Arroz (100 g cocido) — 130 kcal",
    "🥔 Papa (100 g cocida) — 77 kcal",
    "🌽 Maíz (100 g) — 96 kcal",
    "🍞 Pan integral (50 g) — 120 kcal",
    "🌾 Avena (50 g) — 190 kcal",
    "🍠 Batata (100 g) — 86 kcal",
    "🍝 Fideos integrales (100 g) — 124 kcal",
    "🌾 Quinoa (100 g cocida) — 120 kcal",
    "🍪 Galletas de arroz (2 unidades) — 60 kcal",
    "🌾 Salvado de avena (30 g) — 102 kcal"
  ],
  verduras: [
    "🥦 Brócoli (100 g) — 34 kcal",
    "🥕 Zanahoria (100 g) — 41 kcal",
    "🥬 Espinaca (100 g) — 23 kcal",
    "🍅 Tomate (100 g) — 18 kcal",
    "🥒 Pepino (100 g) — 15 kcal",
    "🥬 Lechuga (100 g) — 15 kcal",
    "🫑 Morrón / Pimiento (100 g) — 20 kcal",
    "🎃 Zapallo / Calabaza (100 g) — 26 kcal",
    "🌱 Espárragos (100 g) — 20 kcal",
    "🍄 Champiñones (100 g) — 22 kcal"
  ],
  frutas: [
    "🍎 Manzana (100 g) — 52 kcal",
    "🍌 Banana (100 g) — 89 kcal",
    "🍊 Naranja (100 g) — 47 kcal",
    "🍇 Uvas (100 g) — 69 kcal",
    "🍓 Frutillas / Fresas (100 g) — 32 kcal",
    "🥑 Palta / Aguacate (50 g) — 80 kcal",
    "🍍 Piña / Ananá (100 g) — 50 kcal",
    "🥝 Kiwi (100 g) — 61 kcal",
    "🍑 Durazno (100 g) — 39 kcal",
    "🍉 Sandía (100 g) — 30 kcal"
  ],
  legumbres: [
    "🌱 Lentejas (100 g cocidas) — 116 kcal",
    "🫘 Garbanzos (100 g cocidos) — 164 kcal",
    "🫘 Porotos / Frijoles negros (100 g) — 132 kcal",
    "🫛 Arvejas / Guisantes (100 g) — 81 kcal",
    "🌱 Soja texturizada (30 g en seco) — 105 kcal",
    "🌱 Habas (100 g cocidas) — 110 kcal",
    "🫘 Alubias blancas (100 g cocidas) — 139 kcal",
    "🌱 Cacahuates / Maní (15 g) — 85 kcal",
    "🌰 Almendras (15 g) — 88 kcal",
    "🌰 Nueces (15 g) — 98 kcal"
  ],
  permitidos: [
    "🍫 Chocolate negro (20 g) — 110 kcal",
    "🍪 Galleta simple (25 g) — 120 kcal",
    "🥧 Porción pequeña de torta (50 g) — 180 kcal",
    "🍯 Miel (15 g, 1 cucharada) — 50 kcal",
    "🍦 Helado (50 g, 1 bola) — 100 kcal",
    "🥤 Bebida azucarada (150 ml) — 60 kcal",
    "🍿 Pochoclos / Palomitas (20 g) — 75 kcal",
    "🍮 Flun casero (50 g) — 72 kcal",
    "🍩 Mini dona (1 unidad) — 115 kcal",
    "🍬 Caramelos masticables (3 unidades) — 60 kcal"
  ]
};

export default function NutricionScreen({ navigation }: Props) {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [imc, setImc] = useState<number | null>(null);
  const [genero, setGenero] = useState<string>('');
  const [calorias, setCalorias] = useState<{label:string, value:number, color:string}[]>([]);
  const [macros, setMacros] = useState<{label:string, value:string, color:string}[]>([]);
  
  // ⚡ Estados para almacenar las comidas seleccionadas del día
  const [selectedFoods, setSelectedFoods] = useState({
    animal: [] as string[],
    cereales: [] as string[],
    verduras: [] as string[],
    frutas: [] as string[],
    legumbres: [] as string[],
    permitidos: [] as string[]
  });

  // Función auxiliar para obtener N elementos aleatorios sin repetir de un arreglo
  const getRandomElements = (arr: string[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

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

            // 🎲 Selección de alimentos aleatoria (Trae 3 diferentes de la lista de 10)
            setSelectedFoods({
              animal: getRandomElements(FOOD_POOL.animal, 3),
              cereales: getRandomElements(FOOD_POOL.cereales, 3),
              verduras: getRandomElements(FOOD_POOL.verduras, 3),
              frutas: getRandomElements(FOOD_POOL.frutas, 3),
              legumbres: getRandomElements(FOOD_POOL.legumbres, 2),
              permitidos: getRandomElements(FOOD_POOL.permitidos, 1)
            });
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

        <View style={styles.macrosBox}>
          <Text style={styles.title}>Macronutrientes y agua</Text>
          {macros.map((m, idx) => (
            <View key={idx} style={styles.macroRow}>
              <View style={[styles.dot, {backgroundColor:m.color}]} />
              <Text style={styles.macroItem}>{m.label}: {m.value}</Text>
            </View>
          ))}
        </View>

        {/* 🥗 Renderizado Dinámico de Alimentos Recomendados */}
        <View style={styles.foodBox}>
          <Text style={styles.title}>Alimentos recomendados (origen animal)</Text>
          {selectedFoods.animal.map((item, i) => <Text key={i} style={styles.foodItem}>{item}</Text>)}
        </View>

        <View style={styles.foodBox}>
          <Text style={styles.title}>Cereales y tubérculos</Text>
          {selectedFoods.cereales.map((item, i) => <Text key={i} style={styles.foodItem}>{item}</Text>)}
        </View>

        <View style={styles.foodBox}>
          <Text style={styles.title}>Verduras</Text>
          {selectedFoods.verduras.map((item, i) => <Text key={i} style={styles.foodItem}>{item}</Text>)}
        </View>

        <View style={styles.foodBox}>
          <Text style={styles.title}>Frutas</Text>
          {selectedFoods.frutas.map((item, i) => <Text key={i} style={styles.foodItem}>{item}</Text>)}
        </View>

        <View style={styles.foodBox}>
          <Text style={styles.title}>Legumbres</Text>
          {selectedFoods.legumbres.map((item, i) => <Text key={i} style={styles.foodItem}>{item}</Text>)}
        </View>

        <View style={styles.foodBox}>
          <Text style={styles.title}>Permitidos (De manera ocasional)</Text>
          {selectedFoods.permitidos.map((item, i) => <Text key={i} style={styles.foodItem}>{item}</Text>)}
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