
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

type DefinicionDiaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DefinicionDia'>;
type DefinicionDiaScreenRouteProp = RouteProp<RootStackParamList, 'DefinicionDia'>;

type Props = {
  navigation: DefinicionDiaScreenNavigationProp;
  route: DefinicionDiaScreenRouteProp;
};

export default function DefinicionDiaScreen({ navigation, route }: Props) {
  const { day, exercises } = route.params;

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutina de {day} 💪</Text>
      <FlatList
        data={exercises}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.exercise}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:"#fff" },
  title: { fontSize:22, fontWeight:"bold", marginBottom:20, textAlign:"center" },
  card: { marginBottom:15, padding:15, borderWidth:1, borderRadius:8 },
  exercise: { fontSize:18, fontWeight:"600" }
});
