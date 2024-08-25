import { Chart, registerables } from "chart.js";
import annoationPlugin from "chartjs-plugin-annotation";
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

const textPlugin = {
  id: "textPlugin",
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const width = chart.width;
    const height = chart.height;
    const fontSize = 100;
    const text1 = "H1";
    const text2 = "H2";

    ctx.save();
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.8;

    // Draw grey rectangle on the left half
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, width / 2, height);

    // Draw H1 centered within the grey rectangle
    ctx.fillStyle = "white";
    ctx.fillText(text1, width / 4, height / 2);

    // Draw H2
    ctx.fillStyle = "lightgrey";
    ctx.fillText(text2, (3 * width) / 4, height / 2);

    ctx.restore();
  },
};
// Helper function to get and filter rows
const getValidRows = (period) => {
  const rows = document.querySelector(
    `[data-testid="period-${period}"]`,
  ).childNodes;
  if (rows === null) return [];
  return Array.from(rows)
    .map((row) => row.firstChild?.childNodes)
    .filter(
      (row) =>
        row &&
        row.length >= 3 &&
        row[1] &&
        row[1]?.firstChild?.innerText !== "Foul",
    );
};

// Helper function to process a valid row and extract time and delta
const processRow = (row, halfOffset = 0) => {
  const [minutes, seconds] = row[0].innerText.split(":");
  const time = 2400 - ((Number(minutes) + halfOffset) * 60 + Number(seconds));
  console.log(typeof time);
  const [teamA, teamB] = row[2].innerText.split(" - ");
  console.log({
    ms: `${Number(minutes) + halfOffset}:${Number(seconds)}`,
    time,
    delta: Number(teamA) - Number(teamB),
  });
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
const secondHalfResults = processHalf("2nd-half", 0);
const firstHalfResults = processHalf("1st-half", 20);
const allResults: { time: number; delta: number }[] = [
  { time: 0, delta: 0 },
  ...firstHalfResults,
  ...secondHalfResults,
].sort((a, b) => a.time - b.time);
// Flatten times and deltas into separate arrays
const times = allResults.map((result) => result.time);
const deltas = allResults.map((result) => result.delta);
times.push(2400);
deltas.push(deltas.at(-1));
// Create the chart
Chart.register(...registerables, annoationPlugin);
// Create and append canvas element
const canvas = document.createElement("canvas");

canvas.id = "myChart";
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);
const graphSize =
  Math.round(Math.max(Math.max(...deltas), Math.abs(Math.min(...deltas))) / 2) *
    2 +
  4;
const ctx = canvas.getContext("2d");
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: times,
    datasets: [
      {
        // label: "Score",
        normalized: true,

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
      title: {
        display: true,
        text: "Custom Chart Title",
        fullSize: false,
      },
      backgroundColor: backgroundPlugin,
      legend: { display: false },
      textPlugin: true,
    },
    scales: {
      x: {
        type: "linear",
        grid: {
          display: false,
        },
        min: 0,
        max: 2400,
        ticks: { display: false },
      },
      y: {
        min: -graphSize,
        max: graphSize,
        reverse: false,
        grid: {
          lineWidth: ({ tick }) => {
            console.log(tick.value);
            return tick.value == 0 ? 1 : 0;
          },
          drawTicks: false,

          // color: "black",
        },
        ticks: {
          stepSize: graphSize < 20 ? 1 : 2,
        },
      },
    },
  },

  plugins: [backgroundPlugin, textPlugin],
});
ctx.save();
ctx.beginPath();
ctx.stroke();
ctx.restore();

const button = document.createElement("button");
button.innerText = "flip across x axis";
button.onclick = () => {
  myChart.options.scales.y.reverse = !myChart.options.scales.y.reverse;
  myChart.update();
};
document.body.appendChild(button);
