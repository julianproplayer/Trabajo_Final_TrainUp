import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Picker } from '@react-native-picker/picker';

type Props = NativeStackScreenProps<RootStackParamList, 'Metricas'>;

export default function MetricasScreen({ route, navigation }: Props) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [genero, setGenero] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 🔑 Detectar si viene de registro o de perfil
  useEffect(() => {
    if (route.params?.username && route.params?.password) {
      // Caso registro
      setUsername(route.params.username);
      setPassword(route.params.password);
    } else {
      // Caso perfil → cargar usuario actual
      const loadUser = async () => {
        const currentUserKey = await AsyncStorage.getItem('currentUser');
        if (currentUserKey) {
          const savedUser = await AsyncStorage.getItem(currentUserKey);
          if (savedUser) {
            const userObj = JSON.parse(savedUser);
            setUsername(userObj.username);
            setPassword(userObj.password);
            setNombre(userObj.nombre);
            setEdad(userObj.edad);
            setPeso(userObj.peso);
            setAltura(userObj.altura);
            setGenero(userObj.genero);
          }
        }
      };
      loadUser();
    }
  }, [route.params]);

  const saveUser = async () => {
    if (!nombre || !edad || !peso || !altura || !genero) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const newUser = { username, password, nombre, edad, peso, altura, genero };

    try {
      await AsyncStorage.setItem(`user_${username}`, JSON.stringify(newUser));
      await AsyncStorage.setItem('currentUser', `user_${username}`);
      Alert.alert("Éxito", "Usuario guardado ✅");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el usuario");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completa tus métricas</Text>

      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Peso (kg)" value={peso} onChangeText={setPeso} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Altura (cm)" value={altura} onChangeText={setAltura} keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>Género</Text>
      <Picker selectedValue={genero} onValueChange={(itemValue) => setGenero(itemValue)} style={styles.picker}>
        <Picker.Item label="Selecciona género..." value="" />
        <Picker.Item label="Hombre" value="Hombre" />
        <Picker.Item label="Mujer" value="Mujer" />
      </Picker>

      <Button title="Guardar" onPress={saveUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#fff" },
  title: { fontSize:20, marginBottom:20, fontWeight:"bold" },
  input: { borderWidth:1, margin:5, width:250, padding:8, borderRadius:5 },
  label: { marginTop:10, fontSize:16, fontWeight:"500" },
  picker: { height:50, width:250, marginVertical:10 }
});
