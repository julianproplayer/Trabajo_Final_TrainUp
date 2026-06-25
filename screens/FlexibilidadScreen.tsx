// FlexibilidadScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, FlatList, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type FlexibilidadScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Volumen'>;

type Props = { 
  navigation: FlexibilidadScreenNavigationProp; 
};

const initialRoutines = [
  // Lunes: Flexibilidad de Tren Inferior (Piernas y Cadera)
  [
    { id: '1', title: 'Estiramiento de Isquiotibiales', description: '3 series de 30 segundos por pierna' },
    { id: '2', title: 'Postura de la Paloma (Glúteos)', description: '3 series de 45 segundos por lado' },
    { id: '3', title: 'Zancada profunda (Flexores de cadera)', description: '3 series de 30 segundos' },
    { id: '4', title: 'Estiramiento de Cuádriceps de pie', description: '3 series de 30 segundos por pierna' },
  ],
  // Martes: Movilidad de Columna y Espalda
  [
    { id: '1', title: 'Gato-Camello (Movilidad espinal)', description: '3 series de 12 repeticiones fluidas' },
    { id: '2', title: 'Postura del Niño (Child’s Pose)', description: '3 series de 1 minuto (relajación)' },
    { id: '3', title: 'Torsión espinal supina', description: '3 series de 45 segundos por lado' },
    { id: '4', title: 'Estiramiento de Dorsales (en pared)', description: '3 series de 30 segundos' },
  ],
  // Miércoles: Apertura de Pecho y Hombros
  [
    { id: '1', title: 'Apertura de pecho en pared', description: '3 series de 30 segundos por lado' },
    { id: '2', title: 'Estiramiento de Hombro (Cruzar brazo)', description: '3 series de 30 segundos' },
    { id: '3', title: 'Rotaciones de hombro con bastón/banda', description: '3 series de 15 repeticiones' },
    { id: '4', title: 'Estiramiento de Tríceps tras nuca', description: '3 series de 30 segundos por brazo' },
  ],
  // Jueves: Flexibilidad de Cadera y Aductores (Piernas Pro)
  [
    { id: '1', title: 'Postura de la Rana (Aductores)', description: '3 series de 45 segundos' },
    { id: '2', title: 'Estiramiento de Mariposa', description: '3 series de 1 minuto (espalda recta)' },
    { id: '3', title: 'Cossack Squats (Dinámico)', description: '3 series de 10 repeticiones por lado' },
    { id: '4', title: 'Rotación interna/externa de cadera 90/90', description: '3 series de 12 transiciones' },
  ],
  // Viernes: Descompresión de Espalda Baja y Core
  [
    { id: '1', title: 'Postura de la Cobra (Abdomen/Lumbar)', description: '3 series de 30 segundos' },
    { id: '2', title: 'Rodillas al pecho (Supino)', description: '3 series de 1 minuto' },
    { id: '3', title: 'Estiramiento de Piramidal/Ciático', description: '3 series de 45 segundos por pierna' },
    { id: '4', title: 'Postura del Perro Mirando Abajo', description: '3 series de 45 segundos' },
  ],
  // Sábado: Movilidad y Flexibilidad de Tobillos y Pantorrillas
  [
    { id: '1', title: 'Estiramiento de gemelos en escalón', description: '3 series de 45 segundos por lado' },
    { id: '2', title: 'Movilidad de tobillo hacia la pared', description: '3 series de 15 repeticiones por pie' },
    { id: '3', title: 'Estiramiento de Sóleo (Rodilla flexionada)', description: '3 series de 30 segundos' },
    { id: '4', title: 'Postura del Héroe (Estiramiento de empeines)', description: '3 series de 30 segundos' },
  ],
  // Domingo: Flexibilidad de Cuerpo Completo (Full Body Flow)
  [
    { id: '1', title: 'Saludo al Sol (Fluido y suave)', description: '5 rondas completas a ritmo lento' },
    { id: '2', title: 'Estiramiento de Cadena Posterior', description: '3 series de 45 segundos (buscar puntas)' },
    { id: '3', title: 'Estiramiento del Escorpión (Hombro/Psoas)', description: '3 series de 30 segundos por lado' },
    { id: '4', title: 'Postura del Cadáver (Savasana - Relajación)', description: '1 serie de 3 a 5 minutos' },
  ],
];

const days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

export default function FlexibilidadScreen({ navigation }: Props) {
  const [routines, setRoutines] = useState(initialRoutines);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const shiftRoutines = () => {
    setRoutines(prev => {
      const [first, ...rest] = prev;
      return [...rest, first]; 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <Button title='← Volver' onPress={() => navigation.goBack()}/>
      </View>
      <Text style={styles.title}>Rutina de Flexibilidad 🧘‍♂️</Text>
      <Button title="Reajustar semana ➡️" onPress={shiftRoutines} />
      <Text style={styles.text}>Mueve los ejercicios 1 día por cada toque, para ajustar la rutina en caso de no hacerla</Text>
      <FlatList
        data={days}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Button
              title={item}
              onPress={() => navigation.navigate('VolumenDia', { day: item, exercises: routines[index] })}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:"#fff" },
  title: { fontSize:22, fontWeight:"bold", marginBottom:50, marginTop: 30, textAlign:"center" },
  text: { fontSize:14, color: '#666', textAlign: 'center', marginVertical: 15},
  card: { marginBottom:15 },
  backButton: {
    position:"absolute",
    top:85,   
    left:10,  
    alignSelf:"flex-start"
  }
});