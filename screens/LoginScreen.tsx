import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, BackHandler, ToastAndroid, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type Props = { navigation: LoginScreenNavigationProp };

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  // 👉 Nuevo flujo de registro: navega a MetricasScreen
  const goToRegister = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Completa usuario y contraseña");
      return;
    }
    const existing = await AsyncStorage.getItem(`user_${username}`);
    if (existing) {
      Alert.alert("Error", "Ese usuario ya existe ❌");
      return;
    }
    navigation.navigate("Metricas", { username, password });
  };

  const login = async () => {
    const saved = await AsyncStorage.getItem(`user_${username}`);
    if (saved) {
      const userData = JSON.parse(saved);
      if (userData.password === password) {
        // Guardamos la referencia del usuario actual
        await AsyncStorage.setItem("currentUser", `user_${username}`);
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        Alert.alert("Error", "Contraseña incorrecta ❌");
      }
    } else {
      Alert.alert("Error", "Usuario no existe");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>TrainUp</Text>
      <Text style={styles.version}>Versión 0.6.0 Revisión 1</Text>

      <View style={styles.content}>
        <Text>Registro / Login</Text>
        <TextInput
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <Button title="Registrar" onPress={goToRegister} />
        <Button title="Iniciar sesión" onPress={login} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#fff" },
  appName: { marginTop:40, marginLeft:10, fontSize:24, fontWeight:"bold", color:"#333", alignSelf:"flex-start" },
  version: { marginTop:40, textAlign:"center", fontSize:16, color:"#888" },
  content: { flex:1, justifyContent:"center", alignItems:"center" },
  input: { borderWidth:1, margin:5, width:200, padding:8 }
});
