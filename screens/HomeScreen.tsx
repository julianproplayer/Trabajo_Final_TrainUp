import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const currentUserKey = await AsyncStorage.getItem('currentUser');
      if (currentUserKey) {
        const saved = await AsyncStorage.getItem(currentUserKey);
        if (saved) {
          setUserData(JSON.parse(saved));
        }
      }
    };
    loadUserData();
  }, []);

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

  const renderMetric = (iconName: keyof typeof Ionicons.glyphMap, label: string, value: string) => (
    <View style={styles.metricBox}>
      <Ionicons name={iconName} size={28} color="#333" style={styles.icon} />
      <View style={{ flex:1 }}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del usuario 🏋️</Text>

      {userData ? (
        <View style={styles.metricsContainer}>
          {renderMetric("person", "Usuario", userData.username)}
          {renderMetric("id-card", "Nombre", userData.nombre)}
          {renderMetric("calendar", "Edad", `${userData.edad} años`)}
          {renderMetric("barbell", "Peso", `${userData.peso} kg`)}
          {renderMetric("resize", "Altura", `${userData.altura} cm`)}
          {renderMetric("male-female", "Género", userData.genero)}
        </View>
      ) : (
        <Text style={styles.metricLabel}>No se encontraron métricas</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5", padding:20 },
  title: { fontSize:22, marginBottom:20, fontWeight:"bold" },
  metricsContainer: { width:"100%" },
  metricBox: { flexDirection:"row", alignItems:"center", backgroundColor:"#fff", padding:15, borderRadius:10, marginVertical:8, elevation:3 },
  icon: { marginRight:15 },
  metricLabel: { fontSize:16, color:"#555" },
  metricValue: { fontSize:18, fontWeight:"bold", color:"#222" }
});
