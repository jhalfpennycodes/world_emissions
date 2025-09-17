import axios from "axios";

export async function fetchCountryData(countryCode) {
  try {
    const response = await axios.post("https://world-emissions.vercel.app/", {
      countryCode,
    });
    return response.data;
  } catch (err) {
    console.log(err.response.data);
    // window.alert(
    //   `${err.message} \n Too many request to API, please try again in one hour`
    // );
  }
}

export async function fetchSectorData(countryCode) {
  try {
    const response = await axios.post(
      "https://world-emissions.vercel.app/sectors",
      {
        countryCode,
      }
    );
    return response.data;
  } catch (err) {
    console.log(err.response.data);

    // `${err.message} \n Too many request to API, please try again in one hour`;
  }
}
