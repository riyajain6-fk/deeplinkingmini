import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getProductById} from '../data';
import {colors} from '../theme';

export default function ProductScreen({route}) {
  const product = getProductById(route.params?.id);
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>Main ShopCart catalog</Text>
      <Text style={styles.title}>{product?.name ?? 'Unknown product'}</Text>
      {product && <Text style={styles.meta}>₹{product.price} · {product.id}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: colors.background},
  badge: {color: colors.primary, fontWeight: '700', marginBottom: 8},
  title: {fontSize: 24, fontWeight: '700'},
  meta: {color: colors.muted, marginTop: 8},
});
