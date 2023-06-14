import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  view: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default function ReportScreen() {
  return (
    <View style={styles.view}>
      <Text>Report Screen</Text>
    </View>
  );
}
