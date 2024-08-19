import { Chart, registerables } from "chart.js";
const backgroundPlugin = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

// Helper function to get and filter rows
const getValidRows = (period) => {
  const rows = document.querySelector(
    `[data-testid="period-${period}"]`
  ).childNodes;
  if (rows === null) return [];
  return Array.from(rows)
    .map((row) => row.firstChild?.childNodes)
    .filter(
      (row) =>
        row &&
        row.length >= 3 &&
        row[1] &&
        row[1]?.firstChild?.innerText !== "Foul"
    );
};

// Helper function to process a valid row and extract time and delta
const processRow = (row, halfOffset = 0) => {
  const [minutes, seconds] = row[0].innerText.split(":");
  const time = (Number(minutes) + halfOffset) * 60 + Number(seconds);
  const [teamA, teamB] = row[2].innerText.split(" - ");
  return { time, delta: Number(teamA) - Number(teamB) };
};

/**
 * Process both halves and combine results
 * @param {any} period
 * @param {number} halfOffset
 * @returns
 */
const processHalf = (period, halfOffset) => {
  return getValidRows(period).map((row) => processRow(row, halfOffset));
};

// Combine first and second half results
const firstHalfResults = processHalf("1st-half", 20);
const secondHalfResults = processHalf("2nd-half", 0);
const allResults = [...firstHalfResults, ...secondHalfResults].sort(
  (a, b) => b.time - a.time
);
// Flatten times and deltas into separate arrays
const times = allResults.map((result) => result.time);
const deltas = allResults.map((result) => result.delta);

// score starts at 0-0
times.unshift(0);
deltas.unshift(0);

// score ends with the last score.
times.push(2400);
deltas.push(deltas.at(-1));

console.log(deltas)
console.log(times)

// Create the chart
Chart.register(...registerables);
// Create and append canvas element
const canvas = document.createElement("canvas");

canvas.id = "myChart";
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);
const graphSize = Math.max(Math.max(...deltas), Math.abs(Math.min(...deltas)));
const ctx = canvas.getContext("2d");
if (ctx !== null) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          // label: "Score",
          data: deltas,
          fill: false,
          backgroundColor: "blue",
          stepped: true,
          borderColor: "blue",
          borderWidth: 2,
          pointRadius: 0, // No markers
        },
      ],
    },
    options: {
      plugins: {
        backgroundColor: backgroundPlugin,
        legend: { display: false },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },
          min: 0,
          max: 2400,
          ticks: {
            display: false,
          },
        },
        y: {
          min: -graphSize,
          max: graphSize,
          grid: {
            lineWidth: ({ tick }) => (tick.value == 0 ? 1 : 0),
            drawTicks: false,

            // color: "black",
          },
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
    plugins: [backgroundPlugin],
  });
  ctx.save();
  ctx.beginPath();
  ctx.stroke();
  ctx.restore();
}
