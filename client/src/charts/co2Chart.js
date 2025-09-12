export function createCo2Chart(ctx) {
  const config = {
    type: "doughnut",
    data: {
      labels: ["CO2", "Rest of the World"],
      datasets: [
        {
          label: "CO2 Emissions",
          data: [0, 0],
          backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };
  return new Chart(document.getElementById("co2Chart"), config);
}
