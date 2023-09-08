import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SummaryScreenStack } from '.';
import { useState, useCallback } from 'react';
import DatePickerInput from '../../components/DatePickerInput';
import { ClockIn, ClockInType } from '../../entities/ClockIn';
import { getDateAndTime } from '../../utils/getDateAndTime';
import { useDatabase } from '../../providers/sqlite';

type Props = NativeStackScreenProps<
  SummaryScreenStack,
  'SummaryCustomClockInForm'
>;

type TypeTogglerInputProps = {
  value: string;
  onChange: (value: ClockInType) => void;
};

function TypeTogglerInput({ value, onChange }: TypeTogglerInputProps) {
  const entryBtnStyles: object[] = [styles.typeBtn];
  const entryTextStyles: object[] = [styles.typeBtnText];

  const exitBtnStyles: object[] = [styles.typeBtn];
  const exitTextStyles: object[] = [styles.typeBtnText];

  if (value === ClockInType.Entry) {
    entryBtnStyles.push(styles.typeBtnActive, styles.bgEntry);
    entryTextStyles.push(styles.typeBtnTextActive, styles.textEntry);
  } else {
    exitBtnStyles.push(styles.typeBtnActive, styles.bgExit);
    exitTextStyles.push(styles.typeBtnTextActive, styles.textExit);
  }

  return (
    <View style={styles.typeBtnsView}>
      <TouchableOpacity
        style={entryBtnStyles}
        onPress={() => onChange(ClockInType.Entry)}
        pressRetentionOffset={1}>
        <Text style={entryTextStyles}>Entrada</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={exitBtnStyles}
        onPress={() => onChange(ClockInType.Exit)}
        pressRetentionOffset={1}>
        <Text style={exitTextStyles}>Saída</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CustomClockInFormScreen({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState(ClockInType.Entry);

  const { clockInRepository } = useDatabase();

  const onConfirm = useCallback(async () => {
    const { date, time } = getDateAndTime(selectedDate);
    const clockIn = new ClockIn(date, time, selectedType);
    const inserted = await clockInRepository.insert(clockIn);

    if (inserted) {
      Alert.alert('Sucesso!', 'Registro de ponto salvo com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert(
        'Erro!',
        'Não foi possível salvar o ponto! Verifique se a data e o horário já não foram salvos.',
        [{ text: 'OK' }],
      );
    }
  }, [selectedDate, selectedType, clockInRepository, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.formInfo}>
        <Text style={styles.formInfoTitle}>Marcação Personalizada</Text>
        <Text style={styles.formInfoDescription}>
          Preencha os campos abaixo para fazer uma marcação com data e hora
          personalizadas.
        </Text>
      </View>
      <View style={styles.inputGroup}>
        <DatePickerInput value={selectedDate} onChange={setSelectedDate} />
        <TypeTogglerInput value={selectedType} onChange={setSelectedType} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}>
          <View style={styles.buttonTextContainer}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancelar
            </Text>
            <Feather name="x-circle" size={32} color="#e79f97" />
          </View>
          <Text style={[styles.buttonTextAlt, styles.cancelButtonText]}>
            Voltar para a tela de resumo.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={onConfirm}>
          <View style={styles.buttonTextContainer}>
            <Text style={[styles.buttonText, styles.confirmButtonText]}>
              Confirmar
            </Text>
            <Feather name="check-circle" size={32} color="#82e3aa" />
          </View>
          <Text style={[styles.buttonTextAlt, styles.confirmButtonText]}>
            Marcar com a data e hora informadas
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, gap: 24 },
  formInfo: {
    backgroundColor: '#d5e9f6',
    padding: 16,
    borderRadius: 8,
  },
  formInfoTitle: { fontSize: 16, fontWeight: '700', color: '#2980b9' },
  formInfoDescription: { marginTop: 4, color: '#2980b9' },
  inputGroup: { gap: 12 },
  buttonContainer: { flexDirection: 'row', gap: 24 },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    justifyContent: 'space-between',
  },
  cancelButton: { backgroundColor: '#fceae8' },
  cancelButtonText: { color: '#c0392b' },
  confirmButton: { backgroundColor: '#d5f6e3' },
  confirmButtonText: { color: '#27ae60' },
  buttonTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8,
  },
  buttonText: { fontWeight: '600', fontSize: 20 },
  buttonTextAlt: { marginTop: 8 },
  typeBtnsView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
  },
  typeBtnText: {
    textAlign: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#ddd',
  },
  typeBtnTextActive: { fontWeight: 'bold' },
  bgEntry: { backgroundColor: '#d5f6e3' },
  bgExit: { backgroundColor: '#fceae8' },
  textEntry: { color: '#27ae60' },
  textExit: { color: '#c0392b' },
});
