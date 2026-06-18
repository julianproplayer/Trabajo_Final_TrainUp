// Stack principal
export type RootStackParamList = {
  Login: undefined;
  Metricas: { username: string; password: string }; // 👈 nueva screen con parámetros
  MainTabs: undefined; // Contenedor de las tabs
  Home: undefined;
  Nutrición: undefined;
  Rutinas: undefined;
  Volumen: undefined;
  Definicion: undefined;
  Flexibilidad: undefined;
  Perfil: undefined;
  Acerca: undefined;
  VolumenDia: { day: string; exercises: { id: string; title: string; description: string }[] };
  DefinicionDia: { day: string; exercises: { id: string; title: string; description: string }[] };
  FlexibilidadDia: { day: string; exercises: { id: string; title: string; description: string }[] };
};

// Tabs internas
export type RootTabParamList = {
  Home: undefined;
  Rutinas: undefined;
  Nutrición: undefined;
};
