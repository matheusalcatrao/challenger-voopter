import axios from "axios";
import { API_KEY } from "../constants";

export const getAddress = async (text: string) => {
  try {
    const { data } = await axios.get(
      `https://api.geoapify.com/v1/geocode/autocomplete?apiKey=${API_KEY}&text=${text}`
    );

    return data;
  } catch (error) {
    console.error("Error on getAddress", error);
  }
};
