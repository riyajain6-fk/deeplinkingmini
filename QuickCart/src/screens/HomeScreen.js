import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {PRODUCTS, CATEGORIES} from '../data';
import {colors} from '../theme';

export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>QuickCart · 10 min delivery</Text>
      <Text style={styles.title}>Quick Commerce POC</Text>
      <Text style={styles.subtitle}>
        Tap a product or category to navigate manually. Deep links land here
        first, then route automatically.
      </Text>

      <Text style={styles.section}>Categories</Text>
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Pressable
            style={styles.chip}
            onPress={() => navigation.navigate('Category', {id: item.id})}>
            <Text style={styles.chipText}>{item.name}</Text>
          </Pressable>
        )}
      />

      <Text style={styles.section}>Products</Text>
      <FlatList
        data={PRODUCTS}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('Product', {id: item.id})}>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>₹{item.price}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, padding: 16},
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {fontSize: 24, fontWeight: '700', color: colors.text},
  subtitle: {color: colors.muted, marginTop: 8, marginBottom: 16, lineHeight: 20},
  section: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: colors.text,
  },
  chip: {
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipText: {fontWeight: '600', color: colors.text},
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {fontSize: 16, fontWeight: '600', color: colors.text},
  cardMeta: {color: colors.muted, marginTop: 4},
  arrow: {fontSize: 24, color: colors.primary},
});
