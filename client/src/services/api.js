import axios from "axios";

export async function fetchCountryData(countryCode) {
  const response = await axios.post("http://localhost:8080/", {
    countryCode,
  });
  return response.data;
}

export async function fetchSectorData(countryCode) {
  const response = await axios.post("http://localhost:8080/sectors", {
    countryCode,
  });
  return response.data;
}
