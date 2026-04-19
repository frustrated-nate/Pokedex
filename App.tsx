import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PokedexScreen } from './screens/PokedexScreen';
import { PokemonDetailScreen } from './screens/PokemonDetailScreen';
import { Pokemon } from './types/Pokemon';

type RootStackParamList = {
  Pokedex: undefined;
  PokemonDetail: { pokemon: Pokemon };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const screens = [
    <Stack.Screen
      key="Pokedex"
      name="Pokedex"
      component={PokedexScreen}
      options={{ title: 'Pokédex' }}
    />,
    <Stack.Screen
      key="PokemonDetail"
      name="PokemonDetail"
      component={PokemonDetailScreen}
      options={{ title: 'Detalhes do Pokémon' }}
    />,
  ];

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>{screens}</Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
