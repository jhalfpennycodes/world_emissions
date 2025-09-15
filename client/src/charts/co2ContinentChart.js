export function createCo2ContinentChart(ctx) {
  const config = {
    type: "doughnut",
    data: {
      labels: ["Country", "Continent"],
      datasets: [
        {
          label: "Continent CO2 Emissions",
          data: [0, 0],
          backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
          hoverOffset: 50,
        },
      ],
    },
  };
  return new Chart(document.getElementById("co2ContinentChart"), config);
}
