import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

export const PokedexScreen = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getPokemons(30); // primeiros 30 pokemons
        const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
        setPokemons(details);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage("Falha ao carregar Pokémons. Verifique sua conexão.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = pokemons.filter(p => p.name.includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Carregando Pokémons…</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.errorContainer}>
          <Text>{errorMessage}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Pokédex</Text>
          <TextInput
            placeholder="Buscar pokémon..."
            style={styles.input}
            onChangeText={setSearch}
          />
          <FlatList
            data={filtered}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => <PokemonCard pokemon={item} />}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
