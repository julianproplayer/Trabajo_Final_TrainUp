// DefinicionScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, FlatList, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type DefinicionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Volumen'>;

type Props = { 
  navigation: DefinicionScreenNavigationProp; 
};

const initialRoutines = [
  // Lunes: Pecho, Espalda + HIIT (Circuito metabólico)
  [
    { id: '1', title: 'Biserie: Press inclinado + Remo con mancuernas', description: '4x12 repeticiones sin descanso intermedio' },
    { id: '2', title: 'Fondos en paralelas', description: '3x15 (peso corporal controlado)' },
    { id: '3', title: 'Jalón al pecho (agarre prono)', description: '3x12-15 con peso moderado' },
    { id: '4', title: 'Intervalos HIIT: Burpees', description: '4 rondas de 45 seg activo / 15 seg descanso' },
  ],
  // Martes: Tren Inferior Eficiente (Piernas de acero)
  [
    { id: '1', title: 'Sentadilla Goblet profunda', description: '4x15 (ritmo constante)' },
    { id: '2', title: 'Biserie: Peso muerto rumano + Sancadas pliométricas', description: '3x12 + 10 por lado' },
    { id: '3', title: 'Prensa inclinada', description: '3x15-20 (altas repeticiones, bombeo máximo)' },
    { id: '4', title: 'Elevación de talones (pantorrillas)', description: '4x20 con pausa arriba' },
  ],
  // Miércoles: Hombros, Brazos + Abdomen dinámico
  [
    { id: '1', title: 'Press militar con mancuernas', description: '4x12' },
    { id: '2', title: 'Biserie: Elevaciones laterales + Pec Deck inverso', description: '3x15 + 15 sin parar' },
    { id: '3', title: 'Superserie: Curl de bíceps + Extensión de tríceps', description: '3x12 repeticiones cada uno' },
    { id: '4', title: 'Circuito Core: Plancha + Escaladores', description: '3 rondas de 1 minuto continuo' },
  ],
  // Jueves: Cardio LISS / Descanso Activo
  [
    { id: '1', title: 'Ruta dinámica al aire libre o Cinta', description: '30-40 minutos a ritmo moderado (zona 2)' },
    { id: '2', title: 'Sentadilla isométrica contra pared', description: '3 series de 45 segundos' },
    { id: '3', title: 'Flexiones de brazos de diamante', description: '3x12-15' },
    { id: '4', title: 'Estiramiento integral de tren inferior', description: '10 minutos al finalizar' },
  ],
  // Viernes: Full Body metabólico (Quema de grasa total)
  [
    { id: '1', title: 'Sentadilla con press de hombros (Thrusters)', description: '4x12 completas' },
    { id: '2', title: 'Remo Gironda en polea baja', description: '3x15 enfocado en la contracción' },
    { id: '3', title: 'Aperturas planas con mancuernas', description: '3x15 buscando elongación' },
    { id: '4', title: 'Salto a la cuerda o Jumping Jacks', description: '4 rondas de 1 minuto sin parar' },
  ],
  // Sábado: Pierna enfocado en Cadena Posterior + Core
  [
    { id: '1', title: 'Hip Thrust con barra', description: '4x12-15 apretando glúteos 2 seg arriba' },
    { id: '2', title: 'Silla de isquiotibiales', description: '3x15 controlando la bajada' },
    { id: '3', title: 'Extensión de cuadriceps (Drop-sets)', description: '3x12 (bajar peso y hacer 6 más)' },
    { id: '4', title: 'Abdominales: Elevación de piernas suspendido', description: '4x12 al fallo' },
  ],
  // Domingo: Cardio HIIT intenso (Vaciado de glucógeno)
  [
    { id: '1', title: 'Sprints de carrera (al aire libre o cinta)', description: '10 series de 30 seg máxima velocidad / 30 seg descanso' },
    { id: '2', title: 'Kettlebell Swings (o mancuerna)', description: '4x20 dinámicos' },
    { id: '3', title: 'Flexiones de brazos tradicionales', description: '3x15-20 rápidas' },
    { id: '4', title: 'Caminata lenta de vuelta a la calma', description: '5-10 minutos para recuperar pulsaciones' },
  ],
];

const days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

export default function DefinicionScreen({ navigation }: Props) {
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
      <Text style={styles.title}>Rutina de Definición ✂️</Text>
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