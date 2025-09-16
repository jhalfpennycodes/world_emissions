export function updateChart(co2Chart, ch4Chart, value, data) {
  if (value === "world" && data) {
    document.getElementById(
      "co2-value"
    ).textContent = `${data.co2.toLocaleString()} MT`;
    document.getElementById(
      "restCo2-value"
    ).textContent = `${data.worldCo2.toLocaleString()} MT`;
    document.getElementById(
      "ch4-value"
    ).textContent = `${data.ch4.toLocaleString()} MT`;
    document.getElementById(
      "restCh4-value"
    ).textContent = `${data.worldCh4.toLocaleString()} MT`;

    document.getElementById(
      "countryCo2-text"
    ).textContent = `${data.country} co2 values:`;
    document.getElementById(
      "countryCh4-text"
    ).innerHTML = `${data.country} ch4 value: `;
    document.getElementById("restCo2-text").innerHTML =
      "Rest of the World co2 value: ";
    document.getElementById("restCh4-text").innerHTML =
      "Rest of the World ch4 value: ";

    co2Chart.data.labels = [data.country, "Rest of the World"];
    co2Chart.data.datasets[0].data = [
      data.countryCo2Percentage,
      data.restOfWorldCo2Percentage,
    ];
    co2Chart.update();

    ch4Chart.data.labels = [data.country, "Rest of the World"];
    ch4Chart.data.datasets[0].data = [
      data.countryCh4Percentage,
      data.restOfWorldCh4Percentage,
    ];
    ch4Chart.update();
  } else if (value === "continent" && data) {
    document.getElementById("co2-value").textContent = data.co2;
    document.getElementById("restCo2-value").textContent = data.continentCo2;
    document.getElementById("ch4-value").textContent = data.ch4;
    document.getElementById("restCh4-value").textContent = data.continentCh4;

    document.getElementById(
      "countryCo2-text"
    ).textContent = `${data.country} co2 values:`;
    document.getElementById(
      "countryCh4-text"
    ).innerHTML = `${data.country} ch4 value: `;
    document.getElementById(
      "restCo2-text"
    ).innerHTML = `Rest of ${data.continent} co2 value: `;
    document.getElementById(
      "restCh4-text"
    ).innerHTML = `Rest of ${data.continent} ch4 value: `;
    co2Chart.data.labels = [data.country, data.continent];
    co2Chart.data.datasets[0].data = [
      data.countryToContinentCo2Percentage,
      data.restOfContinentCo2Percentage,
    ];
    co2Chart.update();

    ch4Chart.data.labels = [data.country, data.continent];
    ch4Chart.data.datasets[0].data = [
      data.countryToContinentCh4Percentage,
      data.restOfContinentCh4Percentage,
    ];
    ch4Chart.update();
  } else {
    co2Chart.update();
    ch4Chart.update();
  }
}
