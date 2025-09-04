import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from "axios";

document.addEventListener("DOMContentLoaded", function () {
  let root = am5.Root.new("chartdiv");
  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5map.MapChart.new(root, {
      panX: "rotateX",
      panY: "rotateY",
      projection: am5map.geoOrthographic(),
      paddingBottom: 20,
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
    })
  );

  let polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
    })
  );

  polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    toggleKey: "active",
    interactive: true,
  });

  polygonSeries.mapPolygons.template.states.create("hover", {
    fill: root.interfaceColors.get("primaryButtonHover"),
  });

  polygonSeries.mapPolygons.template.states.create("active", {
    fill: root.interfaceColors.get("primaryButtonHover"),
  });

  // Background
  let backgroundSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {})
  );
  backgroundSeries.mapPolygons.template.setAll({
    fill: root.interfaceColors.get("alternativeBackground"),
    fillOpacity: 0.1,
    strokeOpacity: 0,
  });
  backgroundSeries.data.push({
    geometry: am5map.getGeoRectangle(90, 180, -90, -180),
  });

  // Graticule
  let graticuleSeries = chart.series.unshift(
    am5map.GraticuleSeries.new(root, {
      step: 10,
    })
  );
  graticuleSeries.mapLines.template.set("strokeOpacity", 0.1);

  let previousPolygon;
  let currentCountryId;

  polygonSeries.mapPolygons.template.on("active", function (active, target) {
    if (previousPolygon && previousPolygon != target) {
      previousPolygon.set("active", false);
    }
    if (target.get("active")) {
      currentCountryId = target.dataItem.get("id");
      selectCountry(target.dataItem.get("id"));
    }
    previousPolygon = target;
  });

  // Rotate animation
  chart.animate({
    key: "rotationX",
    from: 0,
    to: 360,
    duration: 30000,
    loops: Infinity,
  });

  // Make stuff animate on load
  chart.appear(1000, 100);

  async function selectCountry(id) {
    try {
      const result = await axios.post("http://localhost:8080/", {
        countryCode: id,
      });
      console.log("Data:", result.data);
      console.log("Country:", result.data[0].country);
      console.log("CO2 Emissions:", result.data[0].emissions.co2);
      document.getElementById("country-name").textContent =
        result.data[0].country;
      document.getElementById("country-CO2").textContent =
        result.data[0].emissions.co2;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    var dataItem = polygonSeries.getDataItemById(id);
    var target = dataItem.get("mapPolygon");
    if (target) {
      var centroid = target.geoCentroid();
      if (centroid) {
        chart.animate({
          key: "rotationX",
          to: -centroid.longitude,
          duration: 1500,
          easing: am5.ease.inOut(am5.ease.cubic),
        });
        chart.animate({
          key: "rotationY",
          to: -centroid.latitude,
          duration: 1500,
          easing: am5.ease.inOut(am5.ease.cubic),
        });
      }
    }
  }

  chart.appear(1000, 100);
});
