import { Chart, registerables } from "chart.js";
// theres a chance this selector is undefined, i don't care.
// document.querySelector('[data-testid="tab-play-by-play"]').click();
// setTimeout(100)
// Helper function to get and filter rows
const getValidRows = (period) => {
  const rows = document.querySelector(
    `[data-testid="period-${period}"]`
  ).childNodes;
  return Array.from(rows)
    .map((row) => row.firstChild?.childNodes)
    .filter(
      (row) => row && row.length >= 3 && row[1].firstChild.innerText !== "Foul"
    );
};

// Helper function to process a valid row and extract time and delta
const processRow = (row, halfOffset = 0) => {
  const [minutes, seconds] = row[0].innerText.split(":");
  const time = (Number(minutes) + halfOffset) * 60 + Number(seconds);
  const [teamA, teamB] = row[2].innerText.split(" - ");
  return { time, delta: Number(teamA) - Number(teamB) };
};

// Process both halves and combine results
const processHalf = (period, halfOffset) => {
  return getValidRows(period).map((row) => processRow(row, halfOffset));
};

// Combine first and second half results
const firstHalfResults = processHalf("1st-half", 20);
const secondHalfResults = processHalf("2nd-half", 0);

// Flatten times and deltas into separate arrays
const times = [...firstHalfResults, ...secondHalfResults].map(
  (result) => result.time
);
const deltas = [...firstHalfResults, ...secondHalfResults].map(
  (result) => result.delta
);

console.log(deltas);
console.log(times);
// Create the chart
Chart.register(...registerables);
// Create and append canvas element
const canvas = document.createElement("canvas");
canvas.id = "myChart";
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: times,
    datasets: [
      {
        label: "Score",
        data: deltas,
        fill: false,
        stepped: true,
        borderColor: "blue",
        borderWidth: 2,
        pointRadius: 0, // No markers
      },
    ],
  },
  options: {
    scales: {
      x: {
        reverse: true, // Invert the x-axis
        min: 0,
        max: 2400,
        ticks: {
          display: false, // Hide x-axis ticks
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Show only even numbers on y-axis
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
    animation: {
      onComplete: function () {
        // Add H1 and H2 texts and background shading after the chart is drawn
        const chartArea = myChart.chartArea;
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;

        // Background shading
        ctx.fillStyle = "rgba(192, 192, 192, 0.5)"; // lightgrey color
        const xStart = myChart.scales.x.getPixelForValue(2400);
        const xEnd = myChart.scales.x.getPixelForValue(1200);
        ctx.fillRect(xEnd, chartArea.top, xStart - xEnd, chartHeight);

        // Text for H2
        ctx.save();
        ctx.font = "100px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const h2X = myChart.scales.x.getPixelForValue(1800);
        ctx.fillText("H2", h2X, (chartArea.bottom + chartArea.top) / 2);

        // Text for H1
        ctx.fillStyle = "rgba(192, 192, 192, 0.3)";
        const h1X = myChart.scales.x.getPixelForValue(600);
        ctx.fillText("H1", h1X, (chartArea.bottom + chartArea.top) / 2);

        ctx.restore();
      },
    },
  },
});

// Draw horizontal black line at y = 0
ctx.save();
ctx.strokeStyle = "black";
ctx.lineWidth = 0.5;
const yZero = myChart.scales.y.getPixelForValue(0);
ctx.beginPath();
ctx.moveTo(myChart.chartArea.left, yZero);
ctx.lineTo(myChart.chartArea.right, yZero);
ctx.stroke();
ctx.restore();
