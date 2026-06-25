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

  const STEP_LENGTH = 0.75; 
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

  useEffect(() => {
    return () => stopAccelerometer();
  }, [subscription]);

  const startAccelerometer = () => {
    if (subscription) return;
    Accelerometer.setUpdateInterval(100);
    let lastStepTime = 0;

    const sub = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      const { x, y, z } = accelerometerData;
      const totalForce = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      
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

  const stopAccelerometer = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  // Renderizador de líneas de texto de fondo para simular la imagen diagonal
  const renderBackgroundWatermark = () => {
    const lines = Array(12).fill("TrainUp   TrainUp   TrainUp   TrainUp");
    return (
      <View style={styles.watermarkContainer} pointerEvents="none">
        {lines.map((text, index) => (
          <Text key={index} style={styles.watermarkText}>
            {text}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Componente de fondo en diagonal */}
      {renderBackgroundWatermark()}

      {/* Contenido principal por encima del fondo */}
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
  
  // Estilos específicos para la marca de agua en diagonal sin usar imágenes externas
  watermarkContainer: {
    position: 'absolute',
    top: -50,
    left: -100,
    right: -100,
    bottom: -50,
    opacity: 0.04, // Ajusta la visibilidad (0.01 a 0.1) según qué tan sutil lo quieras
    transform: [{ rotate: '-25deg' }], // Aplica la inclinación diagonal a todo el bloque
    justifyContent: 'space-around',
  },
  watermarkText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 4,
    textAlign: 'center',
  },

  title: { fontSize:20, marginBottom:30, fontWeight: 'bold' },
  buttons: { gap:15, width: '60%' },
  sensorBox: { marginTop:40, alignItems:"center", backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 5 },
  sensorTitle: { fontSize:16, fontWeight: 'bold', marginBottom:10 },
  stepCount: { fontSize: 22, color: '#007AFF', fontWeight: 'bold', marginTop: 10 },
  distance: { fontSize: 18, color: '#333' }
});