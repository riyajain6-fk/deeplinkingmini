import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {getProductById} from '../data';
import {colors} from '../theme';

export default function ProductScreen({route, navigation}) {
  const {id} = route.params ?? {};
  const product = getProductById(id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Product not found</Text>
        <Text style={styles.meta}>Unknown id: {id}</Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>Deep link target</Text>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.meta}>ID: {product.id}</Text>
      <Text style={styles.meta}>Category: {product.category}</Text>
      <Pressable
        style={styles.button}
        onPress={() =>
          navigation.navigate('Category', {id: product.category})
        }>
        <Text style={styles.buttonText}>View category</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.secondary]}
        onPress={() => navigation.navigate('Home')}>
        <Text style={[styles.buttonText, styles.secondaryText]}>Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, padding: 20},
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.success,
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
    fontWeight: '700',
  },
  title: {fontSize: 26, fontWeight: '700', color: colors.text},
  price: {fontSize: 22, fontWeight: '700', color: colors.primary, marginTop: 8},
  meta: {color: colors.muted, marginTop: 6},
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: '700'},
  secondary: {backgroundColor: colors.card, borderWidth: 1, borderColor: '#ddd'},
  secondaryText: {color: colors.text},
});
