import { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ClockIn, ClockInType } from '../entities/ClockIn';
import { useDatabase } from '../providers/sqlite';

const styles = StyleSheet.create({
  view: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default function SummaryScreen() {
  const [lastFive, setLastFive] = useState<ClockIn[]>([]);
  const { clockInRepository } = useDatabase();

  const newEntry = async () => {
    const dt = new Date().toISOString().split('T');
    const date = dt[0];
    const time = dt[1].slice(0, 5);

    await clockInRepository.insert(new ClockIn(date, time, ClockInType.Entry));
    findLast();
  };

  const findLast = useCallback(async () => {
    const items = await clockInRepository.findLast();
    setLastFive(items);
  }, [clockInRepository]);

  useEffect(() => {
    findLast();
  }, [findLast]);

  return (
    <View style={styles.view}>
      <Button onPress={newEntry} title="Adicionar" color="#841584" />
      {lastFive.map(c => (
        <Text key={c.id}>{JSON.stringify(c)}</Text>
      ))}
    </View>
  );
}
