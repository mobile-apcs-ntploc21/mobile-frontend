import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/constants/theme';

interface CustomTextInputProps {
  title?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  errorMessage?: string;
}

const CustomTextInput = ({
  title,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  errorMessage
}: CustomTextInputProps) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderBottomColor: errorMessage
              ? colors.semantic_red
              : colors.gray01
          }
        ]}
      >
        <Text style={styles.inputTitle}>{title}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </View>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 4
  },
  inputContainer: {
    width: '100%',
    gap: 8,
    padding: 8,
    borderBottomWidth: 1
  },
  inputTitle: {
    fontSize: 12,
    fontFamily: fonts.black,
    color: colors.black,
    marginLeft: 4,
    textTransform: 'uppercase'
  },
  input: {
    width: '100%',
    color: colors.black,
    fontFamily: fonts.regular,
    fontSize: 24
  },
  errorMessage: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.semantic_red
  }
});
