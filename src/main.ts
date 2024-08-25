
import { backgroundPlugin, labelPlugin } from "./plugins";
import { getData } from "./data";


const data = getData();

/**
 * Get the largest absolute value, round it to be even and pad it by 2.
 */
const graphSize =
  Math.round(data.reduce((max, { y }) => Math.max(max, Math.abs(y)), 0) / 2) *
    2 +
  2;

// IIFE to create and render the chart.
(() => {
  const firstHalfSection = document.querySelector(
    `[data-testid="period-1st-half"]`
  );
  //@ts-expect-error welcome to the wild west
  import("https://unpkg.com/chart.js@4.4.4/dist/chart.umd.js").then(() => {


    // Create and append canvas element
    const canvas = document.createElement("canvas");
    canvas.id = "e";
    canvas.width = 1000;
    canvas.height = 500;
    firstHalfSection.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        // labels: times,
        datasets: [
          {
            // label: "Score",
            normalized: true,

            data,
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
            text: document.title.split(",")[0].replace(" v ", " vs "),
            fullSize: false,
            font: { size: 30 },
          },
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
    ctx.save();
    ctx.beginPath();
    ctx.stroke();
    ctx.restore();
  });
})();
