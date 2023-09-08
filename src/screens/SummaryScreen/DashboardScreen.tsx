import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { SummaryScreenStack } from '.';
import { ClockIn, ClockInType } from '../../entities/ClockIn';
import { useDatabase } from '../../providers/sqlite';
import { getDateAndTime } from '../../utils/getDateAndTime';

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
    gap: 24,
  },
  button: { padding: 12, borderRadius: 14, flex: 1 },
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
    marginTop: 20,
    paddingLeft: 14,
    borderLeftWidth: 4,
    borderRadius: 4,
    borderLeftColor: '#3498db',
  },
  entryMasterText: { fontSize: 16, fontWeight: 'bold' },
  entryCardView: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryCardEntry: { borderLeftColor: '#2ecc71' },
  entryCardExit: { borderLeftColor: '#e74c3c' },
  emptyEntries: { marginTop: 8 },
  entryCardDeleteBtn: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 10,
  },
});

type Props = NativeStackScreenProps<SummaryScreenStack, 'SummaryDashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const [lastEntries, setLastEntries] = useState<ClockIn[]>([]);
  const { clockInRepository } = useDatabase();

  const findLast = useCallback(async () => {
    const items = await clockInRepository.findLast(LAST_LIMIT);
    setLastEntries(items);
  }, [clockInRepository]);

  const newEntry = useCallback(async () => {
    const now = new Date();
    const { date, time } = getDateAndTime(now);

    const type =
      lastEntries[0]?.type === ClockInType.Entry
        ? ClockInType.Exit
        : ClockInType.Entry;

    const clockIn = new ClockIn(date, time, type);
    const inserted = await clockInRepository.insert(clockIn);

    if (inserted) {
      setLastEntries(prev => [clockIn, ...prev.slice(0, LAST_LIMIT - 1)]);
    }
  }, [clockInRepository, lastEntries]);

  const removeEntry = useCallback(
    async (clockIn: ClockIn) => {
      await clockInRepository.delete(clockIn);
      setLastEntries(prev => prev.filter(ci => ci.id !== clockIn.id));
      await findLast();
    },
    [clockInRepository, findLast],
  );

  useEffect(() => {
    const navFocusListener = navigation.addListener('focus', () => {
      findLast();
    });

    return () => {
      navigation.removeListener('focus', navFocusListener);
    };
  }, [navigation, findLast]);

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
          <View style={styles.entryMasterView} key={e.date}>
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
          <View>
            <Text style={styles.smallText}>
              {e.type === ClockInType.Entry ? 'Entrada' : 'Saída'} às
            </Text>
            <Text style={styles.bigText}>{e.time}</Text>
          </View>
          <TouchableOpacity
            onPress={() => removeEntry(e)}
            style={styles.entryCardDeleteBtn}>
            <Feather name="trash" color="#c0392b" size={24} />
          </TouchableOpacity>
        </View>,
      );
    });

    return info;
  }, [lastEntries, removeEntry]);

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
        <TouchableOpacity
          style={[styles.customClockInBtn, styles.button]}
          onPress={() => navigation.navigate('SummaryCustomClockInForm')}>
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
