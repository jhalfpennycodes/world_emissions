export function updateChart(co2Chart, ch4Chart, value, data) {
  if (value === "world") {
    co2Chart.data.labels = [data.country, "Rest of the World"];
    co2Chart.data.datasets[0].data = [data.co2, data.worldCo2];
    co2Chart.update();

    document.getElementById("countryName").textContent = data.country;
    document.getElementById("rank").textContent = data.rank;
    document.getElementById("continentName").textContent = data.continent;

    ch4Chart.data.labels = [data.country, "Rest of the World"];
    ch4Chart.data.datasets[0].data = [data.ch4, data.worldCh4];
    ch4Chart.update();
  } else if (value === "continent") {
    co2Chart.data.labels = [data.country, data.continent];
    co2Chart.data.datasets[0].data = [data.co2, data.continentCo2];
    co2Chart.update();

    ch4Chart.data.labels = [data.country, data.continent];
    ch4Chart.data.datasets[0].data = [data.ch4, data.continentCh4];
    ch4Chart.update();
  } else {
    co2Chart.update();
    ch4Chart.update();
  }
}
