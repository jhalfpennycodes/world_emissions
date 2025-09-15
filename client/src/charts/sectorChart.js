const labels = [
  "buildings",
  "manufacturing",
  "fossil-fuel-operations",
  "agriculture",
  "transportation",
  "forestry-and-land-use",
  "mineral-extraction",
  "power",
  "fluorinated-gases",
];

export function createSectorChart(ctx) {
  const config = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: false,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  };
  return new Chart(document.getElementById("sectorChart"), config);
}
