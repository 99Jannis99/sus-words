import React from "react";
import { StyleSheet, Text } from "react-native";
import { TextInput } from "@react-native-material/core";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { Typography } from "../constants/Typography";

const InputField = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  iconName = "search",
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  ...props
}) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      //   label={placeholder}
      label={<Text style={[Typography.input]}>{placeholder}</Text>}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      variant="outlined"
      color={error ? Colors.error : Colors.primary}
      leading={(props) => (
        <MaterialIcons
          name={iconName}
          size={24}
          color={error ? Colors.error : Colors.primary}
        />
      )}
      style={[styles.input, Typography.input]}
      inputContainerStyle={[styles.inputContainer, Typography.input]}
      inputStyle={[styles.inputText, Typography.input]}
      labelStyle={Typography.input}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
  },
  inputContainer: {
    backgroundColor: Colors.surface,
  },
  inputText: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    marginLeft: 8,
    color: Colors.text,
  },
});

export default InputField;
