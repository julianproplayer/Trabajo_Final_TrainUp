
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, FlatList, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type DefinicionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Volumen'>;

type Props = { 
  navigation: DefinicionScreenNavigationProp; 
};

const initialRoutines = [
  [
    { id: '1', title: 'Press banca', description: '4x8 con peso alto' },
    { id: '2', title: 'Press inclinado con mancuernas', description: '3x10' },
    { id: '3', title: 'Fondos en paralelas', description: '3x10' },
    { id: '4', title: 'Extension de triceps', description: '3x12' },
    { id: '5', title: 'Recordatorio', description: 'Lo importante es entrenar al fallo, tome la cantidad de repeticiones como guia y no valores absolutos' },
  ],
  [
    { id: '1', title: 'Sentadilla pesada', description: '4x6-8' },
    { id: '2', title: 'Peso muerto', description: '3x6-8' },
    { id: '3', title: 'Extension de cuadriceps', description: '3x12' },
    { id: '4', title: 'Silla de isquio', description: '3x12' },
    { id: '5', title: 'Recordatorio', description: 'Lo importante es entrenar al fallo, tome la cantidad de repeticiones como guia y no valores absolutos' },
  ],
  [
    { id: '1', title: 'Press militar', description: '4x8 pesado' },
    { id: '2', title: 'Elevaciones laterales', description: '3x10-16' },
    { id: '3', title: 'Pec Deck inverso', description: '3x12' },
    { id: '4', title: 'Crunch de abdominales en maquina', description: '4x10-12' },
    { id: '5', title: 'Recordatorio', description: 'Lo importante es entrenar al fallo, tome la cantidad de repeticiones como guia y no valores absolutos' },
  ],
  [
    { id: '1', title: 'Remo con barra', description: '4x8' },
    { id: '2', title: 'Dominadas', description: '3x10' },
    { id: '3', title: 'Curl de biceps', description: '3x10 pesado' },
    { id: '4', title: 'Curl martillo', description: '4x10-12' },
    { id: '5', title: 'Recordatorio', description: 'Lo importante es entrenar al fallo, tome la cantidad de repeticiones como guia y no valores absolutos' },
  ],
  [
    { id: '1', title: 'Press plano con mancuernas', description: '4x8-10 pesado' },
    { id: '2', title: 'Press inclinado con barra', description: '3x8' },
    { id: '3', title: 'Press frances', description: '3x10-12' },
    { id: '4', title: 'Triceps katana', description: '4x10-12' },
    { id: '5', title: 'Recordatorio', description: 'Lo importante es entrenar al fallo, tome la cantidad de repeticiones como guia y no valores absolutos' },
  ],
  [
    { id: '1', title: 'Sentadilla frontal', description: '4x8' },
    { id: '2', title: 'Prensa', description: '4x6-8' },
    { id: '3', title: 'Hip thrust', description: '3x10-12' },
    { id: '4', title: 'Aductores en maquina', description: '4x12' },
    { id: '5', title: 'Recordatorio', description: 'Lo importante es entrenar al fallo, tome la cantidad de repeticiones como guia y no valores absolutos' },
  ],
  [
    { id: '1', title: 'Jalon al pecho', description: '4x8-12' },
    { id: '2', title: 'Remo gironda', description: '3x10-12' },
    { id: '3', title: 'Curl de biceps predicador', description: '3x12' },
    { id: '4', title: 'Curl concentrado', description: '4x10-12' },
    { id: '5', title: 'Recordatorio', description: 'Lo importante es entrenar al fallo, tome la cantidad de repeticiones como guia y no valores absolutos' },
  ],
];

const days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

export default function VolumenScreen({ navigation }: Props) {
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
      return [...rest, first]; // rota los ejercicios
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <Button title='← Volver' onPress={() => navigation.goBack()}/>
      </View>
      <Text style={styles.title}>Rutina de Definición 💪</Text>
      <Button title="Reajustar semana ➡️" onPress={shiftRoutines} />
      <Text style={styles.text}>Mueve los ejercicios 1 dia por cada toque, para ajustar la rutina en caso de no hacerla</Text>
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
  title: { fontSize:22, fontWeight:"bold", marginBottom:50, textAlign:"center" },
  text: { fontSize:14},
  card: { marginBottom:15 },
  backButton: {
    position:"absolute",
    top:55,   // lo baja un poco para que no quede pegado al notch
    left:10,  // lo empuja a la izquierda
    alignSelf:"flex-start"
  }
});
