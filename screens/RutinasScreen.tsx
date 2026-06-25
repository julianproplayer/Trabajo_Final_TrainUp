import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, ToastAndroid, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { Accelerometer } from 'expo-sensors';

type RutinasScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Rutinas'>;

type Props = {
  navigation: RutinasScreenNavigationProp;
};

export default function RutinasScreen({ navigation }: Props) {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);
  const [steps, setSteps] = useState(0);
  const [meters, setMeters] = useState(0);

  const STEP_LENGTH = 0.75; // longitud promedio en metros
  
  // Umbral de aceleración (en fuerza G). 
  // 1.0 es la gravedad normal en reposo. Un paso suele superar los 1.35 ~ 1.4G.
  const STEP_THRESHOLD = 1.38; 

  // Manejo del botón atrás en Android
  useEffect(() => {
    const backAction = () => {
      if (backPressedOnce) {
        BackHandler.exitApp();
        return true;
      } else {
        setBackPressedOnce(true);
        ToastAndroid.show("Toca atrás otra vez para salir", ToastAndroid.SHORT);
        setTimeout(() => setBackPressedOnce(false), 2000);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [backPressedOnce]);

  // Limpieza automática al salir de la pantalla
  useEffect(() => {
    return () => stopAccelerometer();
  }, [subscription]);

  // Activar acelerómetro
  const startAccelerometer = () => {
    if (subscription) return;

    // 100ms es el punto dulce para capturar pasos sin drenar la batería excesivamente
    Accelerometer.setUpdateInterval(100);

    let lastStepTime = 0;

    const sub = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      const { x, y, z } = accelerometerData;

      // Calcular la fuerza G total usando la norma vectorial: √(x² + y² + z²)
      const totalForce = Math.sqrt(x * x + y * y + z * z);

      const now = Date.now();
      // Filtro de rebote: Evita que un solo paso largo sume 2 o 3 veces seguidas (mínimo 350ms entre pasos)
      if (totalForce > STEP_THRESHOLD && now - lastStepTime > 350) {
        lastStepTime = now;
        setSteps(prev => {
          const newSteps = prev + 1;
          setMeters(newSteps * STEP_LENGTH);
          return newSteps;
        });
      }
    });
    
    setSubscription(sub);
  };

  // Detener acelerómetro
  const stopAccelerometer = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Rutinas 🏋️</Text>
      <View style={styles.buttons}>
        <Button title="Volumen" onPress={() => navigation.navigate('Volumen')} />
        <Button title="Definición" onPress={() => navigation.navigate('Definicion')} />
        <Button title="Flexibilidad" onPress={() => navigation.navigate('Flexibilidad')} />
      </View>

      <View style={styles.sensorBox}>
        <Button 
          title={subscription ? "Detener podómetro" : "Activar podómetro"} 
          onPress={subscription ? stopAccelerometer : startAccelerometer} 
        />
        {subscription && (
          <>
            <Text style={styles.sensorTitle}>Análisis de Movimiento 📱</Text>
            <Text>Fuerza G Total: {Math.sqrt(data.x**2 + data.y**2 + data.z**2).toFixed(2)} G</Text>
            <Text style={styles.stepCount}>Pasos: {steps}</Text>
            <Text style={styles.distance}>Distancia: {meters.toFixed(2)} m</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5" },
  title: { fontSize:20, marginBottom:30 },
  buttons: { gap:15 },
  sensorBox: { marginTop:40, alignItems:"center", backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 2 },
  sensorTitle: { fontSize:16, fontWeight: 'bold', marginBottom:10 },
  stepCount: { fontSize: 22, color: '#007AFF', fontWeight: 'bold', marginTop: 10 },
  distance: { fontSize: 18, color: '#333' }
});