import * as am5 from "@amcharts/amcharts5";
import { createMap } from "./map/mapChart.js";
import { createPolygonSeries } from "./map/polygonSeries.js";
import { createCo2Chart } from "./charts/co2Chart.js";
import { createCh4Chart } from "./charts/ch4Chart.js";
import { fetchCountryData } from "./services/api.js";

document.addEventListener("DOMContentLoaded", function () {
  const root = am5.Root.new("chartdiv");
  const chart = createMap(root);

  const co2Chart = createCo2Chart(document.getElementById("co2Chart"));
  const ch4Chart = createCh4Chart(document.getElementById("ch4Chart"));

  async function selectCountry(id) {
    try {
      const data = await fetchCountryData(id);

      co2Chart.data.labels = [data.country, "Rest of the World"];
      co2Chart.data.datasets[0].data = [data.co2, data.worldCo2];
      co2Chart.update();

      ch4Chart.data.labels = [data.country, "Rest of the World"];
      ch4Chart.data.datasets[0].data = [data.ch4, data.worldCh4];
      ch4Chart.update();
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
    }
  }

  createPolygonSeries(root, chart, selectCountry);

  chart.animate({
    key: "rotationX",
    from: 0,
    to: 360,
    duration: 30000,
    loops: Infinity,
  });
  chart.appear(1000, 100);
});
