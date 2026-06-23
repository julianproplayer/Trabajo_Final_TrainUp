import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type VolumenScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Volumen'>;
type Props = { navigation: VolumenScreenNavigationProp };

const initialRoutines = [
  [
    { id: '1', title: 'Press banca', description: '4x8 con peso alto' },
    { id: '2', title: 'Press inclinado con mancuernas', description: '3x10' },
    { id: '3', title: 'Fondos en paralelas', description: '3x10' },
    { id: '4', title: 'Extension de triceps', description: '3x12' },
    { id: '5', title: 'Recordatorio', description: 'Entrenar al fallo, repeticiones como guía' },
  ],
  [
    { id: '1', title: 'Sentadilla pesada', description: '4x6-8' },
    { id: '2', title: 'Peso muerto', description: '3x6-8' },
    { id: '3', title: 'Extension de cuadriceps', description: '3x12' },
    { id: '4', title: 'Silla de isquio', description: '3x12' },
    { id: '5', title: 'Recordatorio', description: 'Entrenar al fallo, repeticiones como guía' },
  ],
  [
    { id: '1', title: 'Press militar', description: '4x8 pesado' },
    { id: '2', title: 'Elevaciones laterales', description: '3x10-16' },
    { id: '3', title: 'Pec Deck inverso', description: '3x12' },
    { id: '4', title: 'Crunch abdominales en máquina', description: '4x10-12' },
    { id: '5', title: 'Recordatorio', description: 'Entrenar al fallo, repeticiones como guía' },
  ],
  [
    { id: '1', title: 'Remo con barra', description: '4x8' },
    { id: '2', title: 'Dominadas', description: '3x10' },
    { id: '3', title: 'Curl de bíceps', description: '3x10 pesado' },
    { id: '4', title: 'Curl martillo', description: '4x10-12' },
    { id: '5', title: 'Recordatorio', description: 'Entrenar al fallo, repeticiones como guía' },
  ],
  [
    { id: '1', title: 'Press plano con mancuernas', description: '4x8-10 pesado' },
    { id: '2', title: 'Press inclinado con barra', description: '3x8' },
    { id: '3', title: 'Press francés', description: '3x10-12' },
    { id: '4', title: 'Tríceps katana', description: '4x10-12' },
    { id: '5', title: 'Recordatorio', description: 'Entrenar al fallo, repeticiones como guía' },
  ],
  [
    { id: '1', title: 'Sentadilla frontal', description: '4x8' },
    { id: '2', title: 'Prensa', description: '4x6-8' },
    { id: '3', title: 'Hip thrust', description: '3x10-12' },
    { id: '4', title: 'Aductores en máquina', description: '4x12' },
    { id: '5', title: 'Recordatorio', description: 'Entrenar al fallo, repeticiones como guía' },
  ],
  [
    { id: '1', title: 'Jalón al pecho', description: '4x8-12' },
    { id: '2', title: 'Remo gironda', description: '3x10-12' },
    { id: '3', title: 'Curl bíceps predicador', description: '3x12' },
    { id: '4', title: 'Curl concentrado', description: '4x10-12' },
    { id: '5', title: 'Recordatorio', description: 'Entrenar al fallo, repeticiones como guía' },
  ],
];

const days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

// Corregido "Hombre" por "Hombro"
const initialMuscles = [
  'Pecho y tríceps',
  'Piernas',
  'Hombro y abdomen', 
  'Espalda y biceps',
  'Pecho y triceps',
  'Piernas',
  'Espalda y biceps',
];

export default function VolumenScreen({ navigation }: Props) {
  const [routines, setRoutines] = useState(initialRoutines);
  const [muscles, setMuscles] = useState(initialMuscles);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoutines = await AsyncStorage.getItem('volumenRoutines');
        const savedMuscles = await AsyncStorage.getItem('volumenMuscles');
        if (savedRoutines) setRoutines(JSON.parse(savedRoutines));
        if (savedMuscles) setMuscles(JSON.parse(savedMuscles));
      } catch (error) {
        console.error("Error cargando los datos de entrenamiento", error);
      }
    };
    loadData();

    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const shiftRoutines = async () => {
    // Rotamos ambos estados asegurando que se guarden sincronizadamente
    const updatedRoutines = [...routines.slice(1), routines[0]];
    const updatedMuscles = [...muscles.slice(1), muscles[0]];

    setRoutines(updatedRoutines);
    setMuscles(updatedMuscles);

    await AsyncStorage.setItem('volumenRoutines', JSON.stringify(updatedRoutines));
    await AsyncStorage.setItem('volumenMuscles', JSON.stringify(updatedMuscles));
  };

  // Función de emergencia para cuando los datos locales se corrompen o mezclan
  const resetToDefault = async () => {
    setRoutines(initialRoutines);
    setMuscles(initialMuscles);
    await AsyncStorage.removeItem('volumenRoutines');
    await AsyncStorage.removeItem('volumenMuscles');
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <Button title='← Volver' onPress={() => navigation.goBack()}/>
      </View>
      <Text style={styles.title}>Rutina de Volumen 💪</Text>
      <View style={{ gap: 10, marginTop: 30 }}>
        <Button title="Reajustar semana ➡️" onPress={shiftRoutines} />
        <Button title="Restaurar valores originales 🔄" color="#ff4757" onPress={resetToDefault} />
      </View>
      <Text style={styles.text}>Mueve los ejercicios 1 día por cada toque</Text>
      
      <FlatList
        data={days}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Button
              title={`${item} - ${muscles[index] || ''}`}
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
  title: { fontSize:22, fontWeight:"bold", marginBottom:20, textAlign:"center" },
  text: { fontSize:14, marginBottom:10, textAlign:"center" },
  card: { marginBottom:15 },
  backButton: {
    position:"absolute",
    top:50,   // lo baja un poco para que no quede pegado al notch
    left:10,  // lo empuja a la izquierda
    alignSelf:"flex-start"
  }
});