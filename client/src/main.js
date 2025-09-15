import * as am5 from "@amcharts/amcharts5";
import { createMap } from "./map/mapChart.js";
import { createPolygonSeries } from "./map/polygonSeries.js";
import { rotateToCountry } from "./map/rotate.js";
import { fetchCountryData } from "./services/api.js";
import { createCo2Chart } from "./charts/co2Chart.js";
import { createCh4Chart } from "./charts/ch4Chart.js";
import { updateChart } from "./charts/updateChart.js";

document.addEventListener("DOMContentLoaded", function () {
  const co2Chart = createCo2Chart(document.getElementById("co2Chart"));
  const ch4Chart = createCh4Chart(document.getElementById("ch4Chart"));

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
      console.log("Radio changed to:", radioButton);
      updateChart(co2Chart, ch4Chart, radioButton, data);
    });
  });

  async function selectCountry(id) {
    try {
      data = await fetchCountryData(id);
      console.log(data);
      document.getElementById("countryName").textContent = data.country;
      document.getElementById("rank").textContent = data.rank;
      document.getElementById("continentName").textContent = data.continent;

      const radios = document.querySelectorAll('input[name="radio"]');
      console.log(radioButton);
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
