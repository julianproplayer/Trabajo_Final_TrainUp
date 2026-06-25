import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, ToastAndroid, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const currentUserKey = await AsyncStorage.getItem('currentUser');
      if (currentUserKey) {
        const saved = await AsyncStorage.getItem(currentUserKey);
        if (saved) {
          setUserData(JSON.parse(saved));
        }
        const savedImage = await AsyncStorage.getItem(`${currentUserKey}_avatar`);
        if (savedImage) {
          setProfileImage(savedImage);
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

  const tomarFotoPerfil = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permiso requerido", "¡Necesitamos acceso a tu cámara para cambiar la foto de perfil!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);

      const currentUserKey = await AsyncStorage.getItem('currentUser');
      if (currentUserKey) {
        await AsyncStorage.setItem(`${currentUserKey}_avatar`, imageUri);
      }
    }
  };

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
    // Reemplazamos el View principal por un ScrollView
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Sección del Avatar Táctil */}
      <TouchableOpacity style={styles.avatarContainer} onPress={tomarFotoPerfil}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="camera" size={40} color="#666" />
          </View>
        )}
        <View style={styles.cameraBadge}>
          <Ionicons name="add" size={16} color="#fff" />
        </View>
      </TouchableOpacity>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  // Usamos contentContainerStyle para centrar el contenido de forma segura al hacer scroll
  scrollContent: { alignItems: "center", padding: 20, paddingTop: 40, paddingBottom: 40 },
  avatarContainer: { position: 'relative', marginBottom: 15, elevation: 4 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#fff' },
  avatarPlaceholder: { backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center' },
  cameraBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#007AFF', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  title: { fontSize: 22, marginBottom: 20, fontWeight: "bold" },
  metricsContainer: { width: "100%" },
  metricBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 10, marginVertical: 8, elevation: 3 },
  icon: { marginRight: 15 },
  metricLabel: { fontSize: 16, color: "#555" },
  metricValue: { fontSize: 18, fontWeight: "bold", color: "#222" }
});