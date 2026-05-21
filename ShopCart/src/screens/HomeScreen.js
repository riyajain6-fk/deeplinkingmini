import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {PRODUCTS} from '../data';
import {colors} from '../theme';

export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>ShopCart · Full e-commerce POC</Text>
      <Text style={styles.title}>Main Flipkart Simulator</Text>
      <Text style={styles.subtitle}>
        When QuickCart is not installed, /product/* links open here and route
        into the QuickCart Tab (Minutes section).
      </Text>
      <Pressable
        style={styles.minutesBanner}
        onPress={() => navigation.navigate('QuickCartTab', {})}>
        <Text style={styles.minutesTitle}>Open QuickCart Tab →</Text>
        <Text style={styles.minutesSub}>Simulates Flipkart Minutes section</Text>
      </Pressable>
      <FlatList
        data={PRODUCTS.slice(0, 3)}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('Product', {id: item.id})}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>Main catalog · ₹{item.price}</Text>
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
    backgroundColor: colors.primary,
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {fontSize: 24, fontWeight: '700', color: colors.text},
  subtitle: {color: colors.muted, marginTop: 8, marginBottom: 16, lineHeight: 20},
  minutesBanner: {
    backgroundColor: colors.minutes,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  minutesTitle: {color: '#fff', fontWeight: '700', fontSize: 16},
  minutesSub: {color: '#E8F5E9', marginTop: 4},
  card: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {fontWeight: '600'},
  cardMeta: {color: colors.muted, marginTop: 4},
});
