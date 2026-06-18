import React, { useEffect } from "react";
import { View, Text, StyleSheet, BackHandler } from 'react-native';
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
        <View style = {styles.container} >
            <Text style={styles.version}>Versión 0.3.0 Revisión 2</Text>
            <Text style={styles.title}>Acerca de</Text>
            <Text style={styles.text}>TrainUp es la aplicacion de entrenamiento creada por la cadena de gimnasios TrainUp, con TrainUp podras llevar tu cambio fisico tan esperado</Text>
            <Text style={styles.copyright}>© Copyright 2026, todos los derechos reservados</Text>
            <Text style={styles.description}>TrainUp no se hace responsable de ningun tipo de lesion sufrida por el usuario, para mas datos consultar los terminos y condiciones de uso</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#fff" },
  title: { fontSize:22, marginBottom:10},
  text: {fontSize: 16, marginTop: 20},
  copyright: { fontSize: 16, marginTop: 200},
  description: { fontSize: 12, marginTop: 10},
  version: { marginBottom:200, textAlign:"center", fontSize:16, color:"#888" },
});