import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

export const PokedexScreen = () => {
  const insets = useSafeAreaInsets();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getPokemons(30, 0); // primeiros 30 pokemons
        const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
        setPokemons(details);
        setOffset(list.length);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage("Falha ao carregar Pokémons. Verifique sua conexão.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = pokemons.filter(p => p.name.includes(search.toLowerCase()));

  const loadMorePokemons = async () => {
    if (isLoading || isLoadingMore || errorMessage) return;
    setIsLoadingMore(true);
    try {
      const list = await getPokemons(30, offset);
      const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
      setPokemons(prev => [...prev, ...details]);
      setOffset(prev => prev + list.length);
    } catch (error) {
      setErrorMessage("Falha ao carregar mais Pokémons. Verifique sua conexão.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
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
            onEndReached={loadMorePokemons}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              isLoadingMore ? (
                <View style={styles.footerContainer}>
                  <ActivityIndicator size="small" />
                  <Text style={styles.footerText}>Carregando mais Pokémons…</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {search ? `Nenhum Pokémon encontrado para '${search}'` : 'Nenhum Pokémon para exibir no momento.'}
                </Text>
              </View>
            )}
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
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 18, color: '#666', textAlign: 'center' },
  footerContainer: { paddingVertical: 16, alignItems: 'center' },
  footerText: { marginTop: 8, color: '#666' },});