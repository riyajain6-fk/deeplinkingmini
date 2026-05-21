import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {getCategoryById, PRODUCTS} from '../data';
import {colors} from '../theme';

export default function CategoryScreen({route, navigation}) {
  const {id} = route.params ?? {};
  const category = getCategoryById(id);
  const items = PRODUCTS.filter(p => p.category === id);

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Category not found</Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category.name}</Text>
      <Text style={styles.meta}>Category id: {category.id}</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('Product', {id: item.id})}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>₹{item.price}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, padding: 16},
  title: {fontSize: 24, fontWeight: '700', color: colors.text},
  meta: {color: colors.muted, marginBottom: 12},
  card: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {fontWeight: '600', color: colors.text},
  cardMeta: {color: colors.muted, marginTop: 4},
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: '700'},
});
