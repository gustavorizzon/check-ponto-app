import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ClockIn, ClockInType } from '../entities/ClockIn';
import { useDatabase } from '../providers/sqlite';

const LAST_LIMIT = 6;

const styles = StyleSheet.create({
  welcomeCard: {
    backgroundColor: '#d5e9f6',
    marginBottom: 9,
    padding: 18,
    justifyContent: 'space-between',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconView: { padding: 8, backgroundColor: '#eaf4fa', borderRadius: 14 },
  scrollView: { flex: 1 },
  scrollViewContent: { padding: 18 },
  strong: { fontWeight: 'bold' },
  bigText: { fontSize: 22, color: '#444' },
  smallText: { fontSize: 12, color: '#999' },
  buttonGroup: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: { padding: 12, borderRadius: 14, width: '49%' },
  btnDescription: { marginTop: 8 },
  customClockInBtn: {
    backgroundColor: '#eee',
  },
  quickClockInBtn: {
    backgroundColor: '#d5f6e3',
    borderWidth: 1,
    borderColor: '#eafaf1',
  },
  quickBtnText: { color: '#27ae60' },
  lastEntriesLabelView: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  lastEntriesLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#555',
  },
  lastEntriesLabelLine: {
    marginTop: 2,
    height: 3,
    width: '57%',
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
  entryMasterView: {
    marginTop: 16,
    paddingLeft: 14,
    borderLeftWidth: 4,
    borderRadius: 4,
    borderLeftColor: '#3498db',
    backgroundColor: '#eee',
  },
  entryMasterText: { fontSize: 16, fontWeight: 'bold' },
  entryCardView: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    borderLeftWidth: 4,
  },
  entryCardEntry: { borderLeftColor: '#2ecc71' },
  entryCardExit: { borderLeftColor: '#e74c3c' },
  emptyEntries: { marginTop: 8 },
});

export default function SummaryScreen() {
  const [lastEntries, setLastEntries] = useState<ClockIn[]>([]);
  const { clockInRepository } = useDatabase();

  const findLast = useCallback(async () => {
    const items = await clockInRepository.findLast(LAST_LIMIT);
    setLastEntries(items);
  }, [clockInRepository]);

  const newEntry = useCallback(async () => {
    const now = new Date();

    const fullYear = now.getFullYear().toString().padStart(4, '0');
    const fullMonth = String(now.getMonth() + 1).padStart(2, '0');
    const fullDay = String(now.getDate()).padStart(2, '0');
    const date = `${fullYear}-${fullMonth}-${fullDay}`;

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    const type =
      lastEntries[0]?.type === ClockInType.Entry
        ? ClockInType.Exit
        : ClockInType.Entry;

    await clockInRepository.insert(new ClockIn(date, time, type));
    findLast();
  }, [clockInRepository, findLast, lastEntries]);

  useEffect(() => {
    findLast();
  }, [findLast]);

  const entriesView = useMemo(() => {
    if (!lastEntries.length) {
      return [
        <View key="empty-message" style={styles.emptyEntries}>
          <Text>Não há marcações registradas.</Text>
        </View>,
      ];
    }

    let lastDate = '';
    const info: JSX.Element[] = [];
    lastEntries.forEach(e => {
      if (lastDate !== e.date) {
        lastDate = e.date;

        info.push(
          <View style={styles.entryMasterView}>
            <Text style={styles.entryMasterText}>
              Em {e.date.split('-').reverse().join('/')}
            </Text>
          </View>,
        );
      }

      info.push(
        <View
          key={e.id}
          style={[
            styles.entryCardView,
            e.type === ClockInType.Entry
              ? styles.entryCardEntry
              : styles.entryCardExit,
          ]}>
          <Text style={styles.smallText}>
            {e.type === ClockInType.Entry ? 'Entrada' : 'Saída'} às
          </Text>
          <Text style={styles.bigText}>{e.time}</Text>
        </View>,
      );
    });

    return info;
  }, [lastEntries]);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.welcomeCard}>
        <View>
          <Text style={styles.bigText}>
            Olá, <Text style={styles.strong}>Usuário</Text>!
          </Text>
          <Text>Trabalhando hoje? Marque o horário!</Text>
        </View>
        <View style={styles.iconView}>
          <Feather name="calendar" size={36} color="#2980b9" />
        </View>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.customClockInBtn, styles.button]}>
          <Text>
            Marcar{'\n'}
            <Text style={[styles.strong, styles.bigText]}>Horário</Text>
          </Text>
          <Text style={[styles.smallText, styles.btnDescription]}>
            Marcação com data e hora personalizadas.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickClockInBtn, styles.button]}
          onPress={newEntry}>
          <Text style={styles.quickBtnText}>
            Marcação{'\n'}
            <Text style={[styles.strong, styles.bigText, styles.quickBtnText]}>
              Rápida
            </Text>
          </Text>
          <Text
            style={[
              styles.smallText,
              styles.btnDescription,
              styles.quickBtnText,
            ]}>
            Marcação com a data e hora atuais.
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.lastEntriesLabelView}>
        <FontAwesome name="calendar-check-o" size={19} color="#555" />
        <Text style={styles.lastEntriesLabel}>
          Últimas {LAST_LIMIT} marcações:
        </Text>
      </View>
      <View style={styles.lastEntriesLabelLine} />
      {entriesView}
    </ScrollView>
  );
}
