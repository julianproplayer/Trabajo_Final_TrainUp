import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  BackHandler, 
  ToastAndroid, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Image // 1. Agregamos Image aquí
} from 'react-native';
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        
        {/* Encabezado */}
        <View style={styles.header}>
          {/* 2. Renderizamos el logo aquí */}
          <Image 
            source={require('../assets/logo_TrainUp.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.appName}>TrainUp</Text>
          <Text style={styles.subtitle}>Supera tus límites desde hoy</Text>
        </View>

        {/* Tarjeta de Formulario */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingresa a tu cuenta</Text>
          
          <TextInput
            placeholder="Usuario"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
          />
          
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            autoCapitalize="none"
          />

          {/* Botón Principal (Login) */}
          <TouchableOpacity style={styles.primaryButton} onPress={login}>
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          {/* Botón Secundario (Registro) */}
          <TouchableOpacity style={styles.secondaryButton} onPress={goToRegister}>
            <Text style={styles.secondaryButtonText}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>

        {/* Footer con versión */}
        <Text style={styles.version}>v1.0.0 (Rev. 1)</Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1A1A24" 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginTop: 30,
    alignItems: 'center',
  },
  // 3. Estilos aplicados al logo
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: { 
    fontSize: 42, 
    fontWeight: "900", 
    color: "#00FF66", 
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  subtitle: {
    fontSize: 14,
    color: '#AEAEB2',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#2C2C3E', 
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    marginVertical: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: { 
    backgroundColor: '#3A3A50',
    color: '#FFF',
    borderRadius: 12, 
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#00FF66',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#00FF66",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#1A1A24',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#00FF66',
    fontSize: 14,
    fontWeight: '600',
  },
  version: { 
    textAlign: "center", 
    fontSize: 12, 
    color: "#636366",
    marginTop: 10
  }
});