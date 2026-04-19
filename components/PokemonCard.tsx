import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Pokemon } from '../types/Pokemon';
import { capitalize } from '../utils/format';

interface Props {
  pokemon: Pokemon;
  onPress?: () => void;
}

export const PokemonCard = ({ pokemon, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    margin: 8,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  image: { width: 80, height: 80 },
  name: { marginTop: 8, fontWeight: 'bold' },
});
