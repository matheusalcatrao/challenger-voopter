import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

type InputSuggestionsProps = {
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  selectSuggestion: (text: string) => void;
  suggestions: Array<string>;
};

export const InputSuggestions: React.FC<InputSuggestionsProps> = ({
  title,
  value,
  onChangeText,
  selectSuggestion,
  suggestions,
}) => {
  return (
    <>
      <Text style={styles.label}>{title}:</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
      {suggestions.length > 1 && (
        <ScrollView style={{ maxHeight: "25%" }}>
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={String(index)}
              style={styles.listContainer}
              onPress={() => selectSuggestion(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "white",
  },
  input: {
    marginTop: 20,
    borderBottomWidth: 3,
    fontSize: 17,
    color: "white",
    marginBottom: 17,
  },
  listContainer: {
    backgroundColor: "white",
    padding: 10,
  },
});
