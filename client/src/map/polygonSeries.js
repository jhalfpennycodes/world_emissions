import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

export function createPolygonSeries(root, chart, selectCountry) {
  let polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, { geoJSON: am5geodata_worldLow })
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

  let previousPolygon;
  polygonSeries.mapPolygons.template.on("active", function (active, target) {
    if (previousPolygon && previousPolygon !== target) {
      previousPolygon.set("active", false);
    }
    if (target.get("active")) {
      selectCountry(target.dataItem.get("id"));
    }
    previousPolygon = target;
  });

  return polygonSeries;
}
