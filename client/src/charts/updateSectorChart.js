const sectors = [
  "buildings",
  "manufacturing",
  "fossil-fuel-operations",
  "agriculture",
  "transportation",
  "forestry-and-land-use",
  "mineral-extraction",
  "power",
];

export function updateSectorChart(sectorChart, data) {
  sectorChart.data.datasets[0].data = sectors.map((sector) => {
    // Find the object in the array that contains this sector
    const sectorObj = data.find((d) => d[sector]);
    // Extract the co2 value from it
    return sectorObj ? sectorObj[sector].co2 : 0; // default to 0 if not found
  });
  sectorChart.update();
}
