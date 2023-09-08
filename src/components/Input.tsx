import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TextInputProps,
  View,
} from 'react-native';

type Props = TextInputProps & {
  label: string;
  mask?: RegExp;
};

export default function Input({ label, onChange, ...rest }: Props) {
  const test = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    e.nativeEvent.text = '123';
    console.log();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} onChange={test} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  label: {
    position: 'absolute',
    zIndex: 1,
    left: 16,
    top: 8,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    borderRadius: 8,
  },
});
