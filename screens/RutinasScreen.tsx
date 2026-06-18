import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, ToastAndroid, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type RutinasScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Rutinas'>;


type Props = {
  navigation: RutinasScreenNavigationProp;
};

export default function RutinasScreen({ navigation }: Props) {
  const [backPressedOnce, setBackPressedOnce] = useState(false);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Rutinas 🏋️</Text>
      <View style={styles.buttons}>
        <Button title="Volumen" onPress={() => navigation.navigate('Volumen')} />
        <Button title="Definición" onPress={() => navigation.navigate('Definicion')} />
        <Button title="Flexibilidad" onPress={() => navigation.navigate('Flexibilidad')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5" },
  title: { fontSize:20, marginBottom:30 },
  buttons: { gap:15 } // separa los botones
});
