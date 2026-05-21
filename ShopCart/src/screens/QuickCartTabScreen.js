import React, {useEffect} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {getProductById, PRODUCTS} from '../data';
import {colors} from '../theme';

export default function QuickCartTabScreen({route, navigation}) {
  const productId = route.params?.productId;
  const highlighted = productId ? getProductById(productId) : null;

  useEffect(() => {
    if (productId && highlighted) {
      navigation.navigate('QuickCartProduct', {id: productId});
    }
  }, [productId, highlighted, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>QuickCart Tab · 10 min</Text>
      <Text style={styles.title}>Minutes inside ShopCart</Text>
      {highlighted ? (
        <View style={styles.highlight}>
          <Text style={styles.highlightLabel}>Deep link landed here</Text>
          <Text style={styles.highlightName}>{highlighted.name}</Text>
          <Text style={styles.highlightMeta}>₹{highlighted.price}</Text>
        </View>
      ) : (
        <Text style={styles.subtitle}>
          Tap a quick-commerce item or open a /product/* universal link while
          QuickCart is not installed.
        </Text>
      )}
      <FlatList
        data={PRODUCTS}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('QuickCartProduct', {id: item.id})
            }>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>₹{item.price}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E8F5E9', padding: 16},
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.minutes,
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    fontWeight: '700',
  },
  title: {fontSize: 22, fontWeight: '700', marginTop: 8, color: colors.text},
  subtitle: {color: colors.muted, marginVertical: 12},
  highlight: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.minutes,
    marginBottom: 12,
  },
  highlightLabel: {color: colors.minutes, fontWeight: '700'},
  highlightName: {fontSize: 18, fontWeight: '700', marginTop: 4},
  highlightMeta: {color: colors.muted},
  card: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {fontWeight: '600'},
  cardMeta: {color: colors.muted, marginTop: 4},
});
