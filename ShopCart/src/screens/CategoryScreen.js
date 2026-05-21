import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getCategoryById} from '../data';
import {colors} from '../theme';

export default function CategoryScreen({route}) {
  const category = getCategoryById(route.params?.id);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category?.name ?? 'Category'}</Text>
      <Text style={styles.meta}>Main catalog category view</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: colors.background},
  title: {fontSize: 24, fontWeight: '700'},
  meta: {color: colors.muted, marginTop: 8},
});
