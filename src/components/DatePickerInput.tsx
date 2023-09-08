import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Feather from 'react-native-vector-icons/Feather';

type DatePickerInputProps = {
  value: Date;
  onChange: (date: Date) => void;
};

export default function DatePickerInput({
  value,
  onChange,
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.btn}>
        <View>
          <Text style={styles.label}>Data Selecionada:</Text>
          <Text style={styles.dateText}>
            {value.toLocaleDateString('pt-BR')} às{' '}
            {value.toLocaleTimeString().slice(0, 5)}
          </Text>
        </View>
        <Feather name="calendar" size={24} />
      </TouchableOpacity>
      <DatePicker
        modal
        mode="datetime"
        locale="pt"
        open={open}
        date={value}
        onConfirm={date => {
          setOpen(false);
          onChange(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
  },
  label: { fontWeight: 'bold' },
  dateText: { fontSize: 16 },
});
