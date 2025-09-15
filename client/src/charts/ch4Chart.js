export function createCh4Chart(ctx) {
  const config = {
    type: "doughnut",
    data: {
      labels: ["CH4", "Rest of the World"],
      datasets: [
        {
          label: "CH4 Emissions",
          data: [0, 0],
          backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let value = context.raw; // raw number
              return value + "%"; // 👈 add units here
            },
          },
        },
      },
    },
  };
  return new Chart(document.getElementById("ch4Chart"), config);
}
