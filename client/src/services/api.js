import axios from "axios";

export async function fetchCountryData(countryCode) {
  const response = await axios.post("http://localhost:8080/", {
    countryCode,
  });
  return response.data;
}
