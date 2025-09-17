import axios from "axios";

export async function fetchCountryData(countryCode) {
  try {
    const response = await axios.post("http://localhost:8080/", {
      countryCode,
    });
    return response.data;
  } catch (err) {
    window.alert(
      `${err} \n Too many request to API, please try again in one hour`
    );
  }
}

export async function fetchSectorData(countryCode) {
  try {
    const response = await axios.post("http://localhost:8080/sectors", {
      countryCode,
    });
    return response.data;
  } catch (err) {
    `${err} \n Too many request to API, please try again in one hour`;
  }
}
