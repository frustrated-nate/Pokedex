import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pokemon } from '../types/Pokemon';
import { getPokemonSpecies } from '../services/api';
import { capitalize } from '../utils/format';

type RootStackParamList = {
  Pokedex: undefined;
  PokemonDetail: { pokemon: Pokemon };
};

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'>;

export const PokemonDetailScreen = ({ route }: Props) => {
  const { pokemon } = route.params;
  const [description, setDescription] = useState('');
  const [isLoadingDescription, setIsLoadingDescription] = useState(true);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const species = await getPokemonSpecies(pokemon.id);
        setDescription(species.description);
      } catch (error) {
        setDescription('Descrição não disponível.');
      } finally {
        setIsLoadingDescription(false);
      }
    };

    fetchSpecies();
  }, [pokemon.id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
      <Text style={styles.subtitle}>Tipos</Text>
      <Text style={styles.text}>{pokemon.types.join(', ')}</Text>
      <Text style={styles.subtitle}>Altura</Text>
      <Text style={styles.text}>{pokemon.height}</Text>
      <Text style={styles.subtitle}>Peso</Text>
      <Text style={styles.text}>{pokemon.weight}</Text>
      <Text style={styles.subtitle}>Descrição</Text>
      {isLoadingDescription ? (
        <ActivityIndicator size="small" style={styles.loader} />
      ) : (
        <Text style={styles.description}>{description}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, alignItems: 'center' },
  image: { width: 200, height: 200, marginBottom: 20 },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  text: { fontSize: 16, color: '#333', marginTop: 4, textAlign: 'center' },
  description: { fontSize: 16, color: '#555', marginTop: 8, textAlign: 'center', lineHeight: 22 },
  loader: { marginTop: 12 },
});