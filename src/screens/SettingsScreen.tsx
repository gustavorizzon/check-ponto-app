import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  view: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default function SettingsScreen() {
  return (
    <View style={styles.view}>
      <Text>Settings Screen</Text>
    </View>
  );
}
