import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { getAddress } from "../../api/Geocode";

type DayType = {
  dateString: string;
  day: number;
};

type MarkedDates = {
  [key: string]: {
    startingDay: boolean;
    endingDay: boolean;
    color: string;
    textColor: string;
  };
};

const Home: React.FC = () => {
  const [originDaysSelect, setOriginDaySelect] = React.useState<MarkedDates>(
    {}
  );
  const [destinyDaysSelect, setDestiyDaySelect] = React.useState<MarkedDates>(
    {}
  );
  const [showCalendarOrigin, setShowCalendarOrigin] =
    React.useState<boolean>(false);
  const [showCalendarDestiny, setShowCalendarDestiny] =
    React.useState<boolean>(false);
  const [addressOrigin, setAddressOrigin] = React.useState<string>("");
  const [addressDestiny, setAddressDestiny] = React.useState<string>("");
  const [suggestions, setSugestions] = React.useState<Array<string>>([]);

  const handleOpenCalendar = (type: string) => {
    type === "origin"
      ? setShowCalendarOrigin(true)
      : setShowCalendarDestiny(true);
  };

  const handleConfirmDaysSelected = (type: string) => {
    type === "origin"
      ? setShowCalendarOrigin(false)
      : setShowCalendarDestiny(false);
  };

  const handleChangeText = async (text: string) => {
    setAddressOrigin(text);

    if (text.length > 5) {
      const sugestions = await getAddress(text);
      sugestions.features.map((item: any) => {
        setSugestions((old) => [...old, item?.properties?.address_line1]);
      });
    }
  };

  const renderOriginDays = () => {
    const index = Object.keys(originDaysSelect);
    const days = index
      .map((item: string) => item.substring(8))
      .sort((a: any, b: any) => a - b)
      .join(", ");
    return days;
  };

  const renderDestinyDays = () => {
    const index = Object.keys(destinyDaysSelect);
    const days = index
      .map((item: string) => item.substring(8))
      .sort((a: any, b: any) => a - b)
      .join(", ");
    return days;
  };

  const selectDate = (currentDay: DayType, type: string) => {
    const daysSelect = type === "origin" ? originDaysSelect : destinyDaysSelect;
    const setDay = type === "origin" ? setOriginDaySelect : setDestiyDaySelect;
    if (Object.keys(daysSelect).length >= 4) {
      setDay({});
      Alert.alert("Atenção", "Selecione até 4 datas.");
      return;
    }

    const { dateString } = currentDay;
    let payload: MarkedDates = {
      [dateString]: {
        startingDay: Object.keys(daysSelect).length === 0,
        endingDay: Object.keys(daysSelect).length === 1,
        color: "#50cebb",
        textColor: "white",
      },
    };

    if (Object.keys(daysSelect).length > 0) {
      payload = {
        [dateString]: {
          startingDay: Object.keys(daysSelect).length === 0,
          endingDay: Object.keys(daysSelect).length === 1,
          color: "#50cebb",
          textColor: "white",
        },
        ...daysSelect,
      };
    }
    setDay(payload);
  };

  const handleSelectSugestion = (item: string) => {
    setAddressOrigin(item);
    setSugestions([]);
  };

  console.log(suggestions);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.box}
        onPress={() => handleOpenCalendar("origin")}
      >
        <Text style={styles.label}>Datas de ida:</Text>
        <Text style={styles.label}>{renderOriginDays()}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.box}
        onPress={() => handleOpenCalendar("destinny")}
      >
        <Text style={styles.label}>Datas de volta:</Text>
        <Text style={styles.label}>{renderDestinyDays()}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>ORIGEM:</Text>
      <TextInput
        style={styles.input}
        value={addressOrigin}
        onChangeText={handleChangeText}
      />
      {suggestions.length > 1 && (
        <ScrollView style={{ height: 10 }}>
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={String(index)}
              style={styles.listContainer}
              onPress={() => handleSelectSugestion(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Text style={styles.label}>DESTINO:</Text>
      <TextInput
        style={styles.input}
        value={addressDestiny}
        onChangeText={setAddressDestiny}
      />
      <Modal visible={showCalendarOrigin} animationType="slide" transparent>
        <View style={styles.center}>
          <Calendar
            markingType={"period"}
            markedDates={originDaysSelect}
            onDayPress={(day) => selectDate(day, "origin")}
          />
          <Button
            title="Confirmar"
            onPress={() => handleConfirmDaysSelected("origin")}
            color="#50cebb"
          />
        </View>
      </Modal>
      <Modal visible={showCalendarDestiny} animationType="slide" transparent>
        <View style={styles.center}>
          <Calendar
            markingType={"period"}
            markedDates={destinyDaysSelect}
            onDayPress={(day) => selectDate(day, "destiny")}
          />
          <Button
            title="Confirmar"
            onPress={() => handleConfirmDaysSelected("destiny")}
            color="#50cebb"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
  },
  box: {
    maxWidth: "100%",
    padding: 5,
    backgroundColor: "#4d4d4d",
    marginBottom: 30,
  },
  label: {
    color: "white",
  },
  center: {
    flex: 1,
    justifyContent: "flex-end",
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

export default Home;
