import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList, RootTabParamList } from './navigation';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RutinasScreen from './screens/RutinasScreen';
import NutricionScreen from './screens/NutricionScreen';
import MetricasScreen from './screens/MetricasScreen';
import VolumenScreen from './screens/VolumenScreen';
import VolumenDiaScreen from './screens/VolumenDiaScreen';
import DefinicionScreen from './screens/DefinicionScreen';
import DefinicionDiaScreen from './screens/DefinicionDiaScreen';
import FlexibilidadScreen from './screens/FlexibilidadScreen';
import FlexibilidadDiaScreen from './screens/FlexibilidadDiaScreen';
import PerfilScreen from './screens/PerfilScreen';
import AcercaScreen from './screens/AcercaScreen'; // <-- Importamos la nueva screen

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function MainTabs({ navigation }: any) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;
            if (route.name === 'Home') iconName = 'person';
            else if (route.name === 'Rutinas') iconName = 'barbell';
            else iconName = 'fast-food';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            headerRight: () => (
              <Ionicons 
                name="ellipsis-vertical" 
                size={24} 
                style={{ marginRight: 15 }} 
                onPress={openMenu}
              />
            ),
          }}
        />

        <Tab.Screen 
          name="Rutinas" 
          component={RutinasScreen} 
          options={{
            headerRight: () => (
              <Ionicons 
                name="ellipsis-vertical" 
                size={24} 
                style={{ marginRight: 15 }} 
                onPress={openMenu}
              />
            ),
          }}
        />

        <Tab.Screen 
          name="Nutrición" 
          component={NutricionScreen} 
          options={{
            headerRight: () => (
              <Ionicons 
                name="ellipsis-vertical" 
                size={24} 
                style={{ marginRight: 15 }} 
                onPress={openMenu}
              />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Modal del menú */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <View style={styles.overlay}>
          <View style={styles.menuBox}>
            <TouchableOpacity onPress={() => {
              closeMenu();
              navigation.navigate("Perfil");
            }}>
              <Text style={styles.option}>Perfil de usuario</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              closeMenu();
              navigation.navigate("Acerca"); // <-- Nueva opción
            }}>
              <Text style={styles.option}>Acerca de TrainUp</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={async () => {
              closeMenu();
              await AsyncStorage.removeItem('currentUser');
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            }}>
              <Text style={[styles.option, { color: "red" }]}>Cerrar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeMenu}>
              <Text style={styles.option}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Metricas" component={MetricasScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Volumen" component={VolumenScreen} />
        <Stack.Screen name="Definicion" component={DefinicionScreen} />
        <Stack.Screen name="Flexibilidad" component={FlexibilidadScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Acerca" component={AcercaScreen} />
        <Stack.Screen name="VolumenDia" component={VolumenDiaScreen}/>
        <Stack.Screen name="DefinicionDia" component={DefinicionDiaScreen}/>
        <Stack.Screen name="FlexibilidadDia" component={FlexibilidadDiaScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  overlay: { flex:1, backgroundColor:"rgba(0,0,0,0.5)", justifyContent:"center", alignItems:"center" },
  menuBox: { backgroundColor:"#fff", borderRadius:10, padding:20, width:250 },
  option: { fontSize:18, marginVertical:10, textAlign:"center" }
});
