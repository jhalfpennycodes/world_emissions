import * as am5 from "@amcharts/amcharts5";

export function rotateToCountry(chart, polygonSeries, id) {
  const dataItem = polygonSeries.getDataItemById(id);
  const target = dataItem?.get("mapPolygon");
  if (target) {
    const centroid = target.geoCentroid();
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
