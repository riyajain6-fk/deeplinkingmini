import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {getProductById} from '../data';
import {colors} from '../theme';

export default function QuickCartProductScreen({route, navigation}) {
  const product = getProductById(route.params?.id);

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>QuickCart Tab · Product</Text>
      <Text style={styles.title}>{product?.name ?? 'Not found'}</Text>
      {product && (
        <>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.meta}>Routed from ShopCart fallback</Text>
        </>
      )}
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('QuickCartTab', {})}>
        <Text style={styles.buttonText}>Back to QuickCart Tab</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E8F5E9', padding: 20},
  badge: {color: colors.minutes, fontWeight: '700'},
  title: {fontSize: 24, fontWeight: '700', marginTop: 8},
  price: {fontSize: 20, color: colors.primary, fontWeight: '700', marginTop: 8},
  meta: {color: colors.muted, marginTop: 6},
  button: {
    backgroundColor: colors.minutes,
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: '700'},
});
