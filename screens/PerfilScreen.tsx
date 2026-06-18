import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function PerfilScreen() {
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const currentUserKey = await AsyncStorage.getItem('currentUser');
      if (currentUserKey) {
        const savedUser = await AsyncStorage.getItem(currentUserKey);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Usuario 👤</Text>
      {user ? (
        <>
          <Text>Usuario: {user.username}</Text>
          <Text>Nombre: {user.nombre}</Text>
          <Text>Edad: {user.edad}</Text>
          <Text>Peso: {user.peso} kg</Text>
          <Text>Altura: {user.altura} cm</Text>
          <Text>Género: {user.genero}</Text>
        </>
      ) : (
        <Text>No hay usuario cargado</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#fff" },
  title: { fontSize:22, marginBottom:20, fontWeight:"bold" }
});
