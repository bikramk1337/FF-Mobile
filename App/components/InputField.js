import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
const style = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffffcd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#000",
  },
  textInput: {
    flex: 1,
    paddingVertical: 0,
  },
});

export const InputField = (props) => {
  const {
    label,
    icon,
    inputType,
    keyboardType,
    onChangeText,
    condition,
    secureTextEntry,
    value,
    maxLength,
    textContentType,
  } = props;
  return (
    <View style={[style.mainContainer, { ...props?.style }]}>
      {icon}
      {inputType == "password" ? (
        <TextInput
          placeholder={label}
          value={value}
          style={[style.textInput]}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          maxLength={maxLength}
        />
      ) : (
        <TextInput
          placeholder={label}
          value={value}
          style={[style.textInput]}
          keyboardType={keyboardType}
          textContentType={textContentType}
          maxLength={maxLength}
          onChangeText={onChangeText} // Use onChangeText for TextInput
        />
      )}
      {condition}
    </View>
  );
};
