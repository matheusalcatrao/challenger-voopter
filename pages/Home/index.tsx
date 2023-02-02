import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { getAddress } from "../../api/Geocode";
import { InputSuggestions } from "../../components/InputSuggestions";

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

const MIN_TEXT_TO_SEARCHING = 5;
const MAX_DAY_SELECTED = 4;

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
  const [suggestionsAddressOrigin, setSuggestionsAddressOrigin] =
    React.useState<Array<string>>([]);
  const [suggestionsAddressDestiny, setSugestionsAddressDestiny] =
    React.useState<Array<string>>([]);

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

  const handleChangeText = async (text: string, type: string) => {
    const setAddress = type === "origin" ? setAddressOrigin : setAddressDestiny;
    const setSuggestions =
      type === "origin"
        ? setSuggestionsAddressOrigin
        : setSugestionsAddressDestiny;
    setAddress(text);

    if (text.length > MIN_TEXT_TO_SEARCHING) {
      const sugestions = await getAddress(text);
      sugestions.features.map((item: any) => {
        setSuggestions((old) => [...old, item?.properties?.address_line1]);
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
    if (Object.keys(daysSelect).length >= MAX_DAY_SELECTED) {
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

  const handleSelectSugestion = (item: string, type: string) => {
    const setAddress = type === "origin" ? setAddressOrigin : setAddressDestiny;
    const setSuggestions =
      type === "origin"
        ? setSuggestionsAddressOrigin
        : setSugestionsAddressDestiny;

    setAddress(item);
    setSuggestions([]);
  };

  const handleSubmit = () => {
    const dateToGo = Object.keys(originDaysSelect);
    const dateToBack = Object.keys(destinyDaysSelect);
    const request = {
      dateToGo,
      dateToBack,
      addressOrigin,
      addressDestiny,
    };
    const response = [
      {
        name: "trip A",
        price: 900,
        day: "10-02-2023",
        addressOrigin,
        addressDestiny,
      },
      {
        name: "trip B",
        price: 1000,
        day: "15-02-2023",
        addressOrigin,
        addressDestiny,
      },
      {
        name: "trip C",
        price: 1200,
        day: "22-02-2023",
        addressOrigin,
        addressDestiny,
      },
      {
        name: "trip D",
        price: 700,
        day: "25-02-2023",
        addressOrigin,
        addressDestiny,
      },
    ];
    console.log("request", JSON.stringify(request));
    console.log("response", JSON.stringify(response));
  };

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
      <InputSuggestions
        title="ORIGEM"
        value={addressOrigin}
        onChangeText={(item) => handleChangeText(item, "origin")}
        suggestions={suggestionsAddressOrigin}
        selectSuggestion={(item) => handleSelectSugestion(item, "origin")}
      />
      <InputSuggestions
        title="DESTINO"
        value={addressDestiny}
        onChangeText={(item) => handleChangeText(item, "destiny")}
        suggestions={suggestionsAddressDestiny}
        selectSuggestion={(item) => handleSelectSugestion(item, "destiny")}
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
      <View style={{ marginTop: "20%" }}>
        <Button
          title="Pesquisar"
          onPress={() => handleSubmit()}
          color="#50cebb"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "white",
  },
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
  center: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default Home;
