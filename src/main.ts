import { Chart, registerables } from "chart.js";
import { backgroundPlugin, labelPlugin } from "./plugins";

type Half = "1st-half" | "2nd-half";

/**
 *
 * @param period
 * @returns
 */
const getValidRows = (period: Half) => {
  const rows = document.querySelector(
    `[data-testid="period-${period}"]`
  )?.childNodes;
  if (rows === null || rows === undefined) {
    return [];
  }
  return Array.from(rows)
    .map((row) => row.firstChild?.childNodes)
    .filter(
      (row) =>
        row &&
        row.length >= 3 &&
        row[1] &&
        (row[1]?.firstChild as HTMLElement | undefined)?.innerText !== "Foul"
    );
};

/**
 * A helper function to parse a row of into our data object.
 * a row might look like:
 * `12:00 2pts 10-5`
 * as such, parse the first part into seconds and the last part into a delta,
 * ignoring the middle gunk
 * @param row
 * @param halfOffset
 * @returns
 */
const processRow = (row: any, halfOffset = 0) => {
  const [minutes, seconds] = row[0].innerText.split(":");
  const time = 2400 - ((Number(minutes) + halfOffset) * 60 + Number(seconds));
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
 * @param period first or second half
 * @returns an array of objects with a delta and time in seconds
 */
const processHalf = (period: Half) => {
  const halfOffset = period === "1st-half" ? 20 : 0;
  return getValidRows(period).map((row) => processRow(row, halfOffset));
};

// Combine first and second half results
const secondHalfResults = processHalf("2nd-half");
const firstHalfResults = processHalf("1st-half");
const allResults: { time: number; delta: number }[] = [
  { time: 0, delta: 0 },
  ...firstHalfResults,
  ...secondHalfResults,
].sort((a, b) => a.time - b.time);
// Flatten times and deltas into separate arrays
const times = allResults.map((result) => result.time);
const deltas = allResults.map((result) => result.delta);
times.push(2400);
deltas.push(deltas[deltas.length - 1]);
// Create the chart
Chart.register(...registerables);
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
const myChart = new Chart(ctx!, {
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
        text: document.title.split(",")[0],
        fullSize: false,
        font: { size: 30 },
      },
      // backgroundColor: backgroundPlugin,
      legend: { display: false },
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
        border: {
          dash: ({ tick }) => (tick.value === 0 ? [0, 0] : [5, 5]),
        },
        grid: {
          drawTicks: false,
        },
        ticks: {
          stepSize: graphSize < 20 ? 1 : 2,
        },
      },
    },
  },

  plugins: [backgroundPlugin, labelPlugin],
});
ctx?.save();
ctx?.beginPath();
ctx?.stroke();
ctx?.restore();

