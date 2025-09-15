import * as am5 from "@amcharts/amcharts5";
import { createMap } from "./map/mapChart.js";
import { createPolygonSeries } from "./map/polygonSeries.js";
import { rotateToCountry } from "./map/rotate.js";
import { fetchCountryData } from "./services/api.js";
import { fetchSectorData } from "./services/api.js";
import { createCo2Chart } from "./charts/co2Chart.js";
import { createCh4Chart } from "./charts/ch4Chart.js";
import { createSectorChart } from "./charts/sectorChart.js";
import { updateChart } from "./charts/updateChart.js";
import { updateSectorChart } from "./charts/updateSectorChart.js";

document.addEventListener("DOMContentLoaded", function () {
  const co2Chart = createCo2Chart(document.getElementById("co2Chart"));
  const ch4Chart = createCh4Chart(document.getElementById("ch4Chart"));
  const sectorChart = createSectorChart(document.getElementById("sectorChart"));

  const root = am5.Root.new("chartdiv");
  const chart = createMap(root);

  chart.seriesContainer.resizable = false;

  const polygonSeries = createPolygonSeries(root, chart, selectCountry);

  let radioButton = "world";
  let data;

  const radios = document.querySelectorAll('input[name="radio"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const selected = document.querySelector('input[name="radio"]:checked');
      radioButton = selected.value;
      updateChart(co2Chart, ch4Chart, radioButton, data);
    });
  });

  async function selectCountry(id) {
    try {
      const sectorData = await fetchSectorData(id);
      if (sectorData) {
        updateSectorChart(sectorChart, sectorData);
      }
      data = await fetchCountryData(id);
      document.getElementById("countryName").textContent = data.country;
      document.getElementById("rank").textContent = data.rank;
      document.getElementById("continentName").textContent = data.continent;

      const radios = document.querySelectorAll('input[name="radio"]');
      updateChart(co2Chart, ch4Chart, radioButton, data);

      rotateToCountry(chart, polygonSeries, id);
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
    }
  }

  chart.animate({
    key: "rotationX",
    from: 0,
    to: 360,
    duration: 30000,
    loops: Infinity,
  });
  chart.appear(1000, 100);
});
