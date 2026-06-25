import React, { useEffect } from "react";
import { View, Text, StyleSheet, BackHandler, Button } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";

type AcercaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Acerca'>;

type Props = {
    navigation: AcercaScreenNavigationProp;
};

export default function AcercaScreen ({ navigation }: Props) {
    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Botón arriba a la izquierda */}
            <View style={styles.backButton}>
              <Button title="← Volver" onPress={() => navigation.goBack()} />
            </View>

            <Text style={styles.version}>Versión 1.0.0 Revisión 1</Text>
            <Text style={styles.title}>Acerca de</Text>
            <Text style={styles.text}>
              TrainUp es la aplicación de entrenamiento creada por la cadena de gimnasios TrainUp, 
              con TrainUp podrás llevar tu cambio físico tan esperado
            </Text>
            <Text style={styles.copyright}>© Copyright 2026, todos los derechos reservados</Text>
            <Text style={styles.description}>
              TrainUp no se hace responsable de ningún tipo de lesión sufrida por el usuario, 
              para más datos consultar los términos y condiciones de uso
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#fff" },
  title: { fontSize:22, marginBottom:10},
  text: { fontSize:16, marginTop:20, textAlign:"center", paddingHorizontal:20 },
  copyright: { fontSize:16, marginTop:200 },
  description: { fontSize:12, marginTop:10, textAlign:"center", paddingHorizontal:20 },
  version: { marginBottom:200, textAlign:"center", fontSize:16, color:"#888" },
  backButton: {
    position:"absolute",
    top:40,       // baja un poco para que no quede pegado al notch
    left:10,      // lo empuja a la izquierda
    alignSelf:"flex-start"
  }
});
